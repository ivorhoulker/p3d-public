import { useEffect, useState } from "react";
import { client, queryClient } from "../pages/_app";
import { Record as PBRecord } from "pocketbase";
import merge from "lodash.merge";
import { useQuery } from "@tanstack/react-query";
import { removeEmpty } from "../utils/removeEmpty";

const defaultQueryParams = {
  page: "",
  perPage: "",
  sort: "-created",
  filter: "",
  expand: "",
};

//CRUD for local cache
const createPBRecord = (oldData: PBRecord[], newData: PBRecord | undefined) => {
  if (!newData) return oldData;
  return [...oldData, newData] as PBRecord[];
};
const updatePBRecord = (oldData: PBRecord[], newData: PBRecord | undefined) => {
  if (!newData) return oldData;
  return oldData.map((x) => {
    if (x.id === newData.id) return merge(x, newData);
    return x;
  });
};
const deletePBRecord = (oldData: PBRecord[], newData: PBRecord | undefined) => {
  if (!newData) return oldData;
  return oldData.filter((x) => x.id !== newData.id);
};

export const prefetchPocketList = (
  queryKey: string,
  databaseReference: string,
  queryParams: Partial<typeof defaultQueryParams>
) => {
  queryParams = merge(removeEmpty(defaultQueryParams), queryParams);
  queryClient.prefetchQuery([queryKey], () => {
    const records = client.records.getFullList(
      databaseReference,
      200,
      queryParams
    );
    return JSON.parse(JSON.stringify(records));
  });
  return queryClient;
};

export const usePocketList = (
  queryKey: string,
  databaseReference: string,
  subscribe = false,
  queryParams: Partial<typeof defaultQueryParams>
) => {
  queryParams = merge(removeEmpty(defaultQueryParams), queryParams);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const fetchQuery = useQuery([queryKey], () => {
    const records = client.records.getFullList(
      databaseReference,
      200,
      queryParams
    );
    return records;
  });

  const { data } = fetchQuery;

  useEffect(() => {
    if (subscribe && data && !isSubscribed) {
      (async () => {
        await client.realtime.subscribe(databaseReference, (newData) => {
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
        client.realtime.unsubscribe(databaseReference);
        setIsSubscribed(false);
      }
    };
  }, [data, queryKey, isSubscribed, databaseReference, subscribe]);
  return { isSubscribed, ...fetchQuery };
};
