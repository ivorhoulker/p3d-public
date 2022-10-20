import "../styles/globals.css";
import type { AppProps } from "next/app";
import PocketBase from "pocketbase";
import {
  QueryClient,
  QueryClientProvider,
  Hydrate,
} from "@tanstack/react-query";
import { useEffect } from "react";

export const client = new PocketBase(process.env.DATABASE_URL);

export const queryClient = new QueryClient();

// for SSR with react query:
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
