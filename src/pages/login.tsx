import { useEffect } from "react";
import { client } from "./_app";
import nookies from "nookies";
import { NextPageContext } from "next";

export default function Login(ctx: NextPageContext) {
  useEffect(() => {
    //auth();
    //TODO: sign in here
    nookies.set(ctx, "pb_auth", client.authStore.exportToCookie());
  }, [ctx]);
  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-2">
        Login
      </div>
    </div>
  );
}
