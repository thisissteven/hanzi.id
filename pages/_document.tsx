import { Scripts } from "@/components";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@700,500,400&display=swap" />
        <Scripts />
      </Head>
      <body className="bg-black text-white overflow-x-hidden overflow-y-scroll">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
