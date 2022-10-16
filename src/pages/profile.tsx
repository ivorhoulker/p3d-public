import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { User } from "pocketbase";
import nookies from "nookies";
import { client, queryClient } from "./_app";
import Chat from "../components/Chat";

const getChat = async () => {
  const data = await client.records.getFullList("chat", 100);
  return JSON.parse(JSON.stringify(data));
};

export const getServerSideProps = (ctx: GetServerSidePropsContext) => {
  const cookies = nookies.get(ctx);
  if (cookies.pb_auth) {
    client.authStore.loadFromCookie(cookies.pb_auth);
  }

  //   if (!pbClient.authStore.isValid) {
  //     return {
  //       redirect: {
  //         destination: "/login",
  //         permanent: false,
  //       },
  //     };
  //   }

  queryClient.prefetchQuery(["chat"], getChat);
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

const Profile = ({}: InferGetServerSidePropsType<
  typeof getServerSideProps
>) => {
  // Show the user. No loading state is required
  const { data } = useQuery(["chat"], getChat);
  console.log({ data });
  const { email, id, profile } = client.authStore.model as User;
  return (
    <>
      <h1>Your Profile</h1>
      <div>Name: {profile?.name}</div>
      <div>Avatar: {profile?.avatar}</div>
      <div>Id: {id}</div>
      <div>Email: {email}</div>
      <div>{JSON.stringify(profile, null, 2)}</div>
      <Chat />
    </>
  );
};

export default Profile;

// export async function getStaticProps() {
//   const queryClient = new QueryClient();
//   const client = new PocketBase("https://rooftoptheatre.com");
//   await queryClient.prefetchQuery(["profile"], clie);

//   return {
//     props: {
//       dehydratedState: dehydrate(queryClient),
//     },
//   };
// }
