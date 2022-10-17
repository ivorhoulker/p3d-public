import "../styles/globals.css";
import type { AppProps, AppType } from "next/app";
import PocketBase from "pocketbase";
import {
  QueryClient,
  QueryClientProvider,
  Hydrate,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { auth } from "../services/chat";

export const client = new PocketBase("https://rooftoptheatre.com");
// client.beforeSend = function (url, reqConfig) {
//   // For list of the possible reqConfig properties check
//   // https://developer.mozilla.org/en-US/docs/Web/API/fetch#options
//   reqConfig.headers = Object.assign({}, reqConfig.headers, {
//     Origin: "http://localhost:3000",
//   });
//   console.log(reqConfig);
//   return reqConfig;
// };

export const queryClient = new QueryClient();

type CustomPageProps = { dehydratedState: unknown };

const MyApp = ({ Component, pageProps }: AppProps<CustomPageProps>) => {
  useEffect(() => {
    //auth();
    client.authStore.exportToCookie();
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <Component {...pageProps} />
      </Hydrate>
    </QueryClientProvider>
  );
};

export default MyApp;
