import { useEffect } from "react";
import Chat from "../components/Chat/Chat";
import { auth } from "../services/chat";
import { client } from "./_app";
import nookies from "nookies";
import { NextPageContext } from "next";

export default function Page(ctx: NextPageContext) {
  // const [subscription, setSubscription] = useState(false);
  // queryKey equals to ['/posts', { id: 1 }]
  // const variables = { id: "kikbshab5qteg8k" };

  // const { data } = useChat({ variables, suspense: true });
  // useEffect(() => {
  //   if (data && setData && !subscription) {
  //     (async () => {
  //       await client.realtime.subscribe("chat", function (newData) {
  //         // console.log({ newData });
  //         setData(() => updateChat(data as Record[], newData.record));
  //       });
  //       setSubscription(true);
  //     })();
  //   }
  //   return () => {
  //     if (subscription) {
  //       client.realtime.unsubscribe("chat");
  //       setSubscription(false);
  //     }
  //   };
  // }, [data, setData, subscription]);
  const signIn = () => {
    console.log("sign in");
  };
  const signOut = () => {
    console.log("sign out");
  };
  useEffect(() => {
    //auth();
    nookies.set(ctx, "pb_auth", client.authStore.exportToCookie());
  }, []);
  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-2">
        Login
      </div>
    </div>
  );
}
