import Chat from "../components/Chat/Chat";
import { client } from "./_app";

export default function Page() {
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
  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-2">
        {/* {client.authStore.isValid && (
        <p className="text-2xl text-blue-500">
          Logged in as {JSON.stringify(client.authStore.token)}
        </p>
      )} */}

        <button
          className="rounded-md border border-black bg-violet-50 px-4 py-2 text-xl shadow-lg hover:bg-violet-100"
          onClick={client.authStore.isValid ? () => signOut() : () => signIn()}
        >
          {client.authStore.isValid ? "Sign out" : "Sign in"}
        </button>
        <Chat />
      </div>
    </div>
  );
}
