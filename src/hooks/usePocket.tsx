import { useEffect, useState } from "react";
import { client, queryClient } from "../pages/_app";
import { Record as PBRecord } from "pocketbase";
import merge from "lodash.merge";
import { useQuery } from "@tanstack/react-query";

const defaultQueryParams = {
  sort: "created",
  expand: "profile",
};

export const usePocketList = (
  queryKey: string,
  dbTable: string,
  queryParams: Record<string, string>
) => {
  queryParams = merge(defaultQueryParams, queryParams);
  const [isSubscribed, setIsSubscribed] = useState(false);
  //const queryHookObject = queryHook({ variables, suspense });
  const testQuery = useQuery([queryKey], () => {
    const records = client.records.getFullList(dbTable, 200, queryParams);
    return records;
  });

  const { data } = testQuery;
  //CRUD for local cache
  const createPBRecord = (
    oldData: PBRecord[],
    newData: PBRecord | undefined
  ) => {
    if (!newData) return oldData;
    return [...oldData, newData] as PBRecord[];
  };
  const updatePBRecord = (
    oldData: PBRecord[],
    newData: PBRecord | undefined
  ) => {
    if (!newData) return oldData;
    return oldData.map((x) => {
      if (x.id === newData.id) return merge(x, newData);
      return x;
    });
  };
  const deletePBRecord = (
    oldData: PBRecord[],
    newData: PBRecord | undefined
  ) => {
    if (!newData) return oldData;
    return oldData.filter((x) => x.id !== newData.id);
  };
  useEffect(() => {
    if (data && !isSubscribed) {
      (async () => {
        await client.realtime.subscribe(dbTable, (newData) => {
          console.log(
            `new data from ${queryKey}, is *${newData.action}*`,
            newData
          );

          switch (newData.action) {
            case "create":
              queryClient.setQueryData(
                [queryKey],
                createPBRecord(data as PBRecord[], newData.record)
              );
              // setData(() => createPBRecord(data as PBRecord[], newData.record));
              break;
            case "update":
              queryClient.setQueryData(
                [queryKey],
                updatePBRecord(data as PBRecord[], newData.record)
              );
              //setData(() => updatePBRecord(data as PBRecord[], newData.record));
              break;
            case "delete":
              queryClient.setQueryData(
                [queryKey],
                deletePBRecord(data as PBRecord[], newData.record)
              );
              //setData(() => deletePBRecord(data as PBRecord[], newData.record));
              break;
            default:
              console.log("not accounted for");
          }
        });
        setIsSubscribed(true);
      })();
    }
    return () => {
      if (isSubscribed) {
        client.realtime.unsubscribe(queryKey);
        setIsSubscribed(false);
      }
    };
  }, [data, queryKey, isSubscribed]);
  return { isSubscribed, ...testQuery };
};
