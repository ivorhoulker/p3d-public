import { dehydrate } from "@tanstack/react-query";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { User } from "pocketbase";
import nookies from "nookies";
import { client } from "./_app";
import Chat from "../components/Chat/Chat";
import { prefetchPocketList } from "../hooks/usePocketList";

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

  const queryClient = prefetchPocketList("roomChats", "chat", {
    expand: "profile",
    filter: `room="kikbshab5qteg8k"`,
  });
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

const Profile = ({}: InferGetServerSidePropsType<
  typeof getServerSideProps
>) => {
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
