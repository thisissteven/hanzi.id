import { Layout } from "@/modules/layout";
import React from "react";
import { ImagesTool } from "@/modules/tools";

export default function ImagesToolPage() {
  return (
    <Layout>
      <div className="max-md:px-4">
        <ImagesTool />
      </div>
    </Layout>
  );
}
