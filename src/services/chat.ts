import { client } from "../pages/_app";
import { Chat } from "../types/chat";

export const auth = async() => {
    console.log(client.authStore)
    const response = await client.users.authViaEmail(process.env.NEXT_TEST_USER || "", process.env.NEXT_TEST_PW || "");
    return response
}

export const chat = async () => {
    //await auth()
    const records = await client.records.getFullList('chat', 200, /* batch size */{
        sort: '-created',
        origin: "localhost"
    });
    return records as Chat[];
  }

//   export const allChat = async (): Promise<Chat[]> => {
//     return (await client.records.getFullList(
//       "chat",
//       200 /* batch size */,
//       {
//         sort: "-created",
//       }
//     )) as Chat[];
//   };

  // export const realTime = async (index: [string], queryClient: QueryClient) => {
//   return await pocketbaseClient.realtime.subscribe("peeps", function (e) {
//     console.log("real time peeps", e.record);
//   });
// };