import { Layout } from "@/modules/layout";
import { NewReadingContent } from "@/modules/new";
import { useRouter } from "next/navigation";
import React from "react";

export default function Image() {
  const router = useRouter();

  return (
    <Layout>
      <form className="max-md:px-4">
        <NewReadingContent
          type="text"
          onReturn={() => router.back()}
          onPreview={() =>
            router.push("/new/preview", {
              scroll: false,
            })
          }
        />
      </form>
    </Layout>
  );
}
