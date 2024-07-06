import { Layout } from "@/modules/layout";
import React from "react";
import { HanziWriterTool } from "@/modules/tools/hanzi-writer";

export default function HanziWriterToolPage() {
  return (
    <Layout>
      <div className="max-md:px-4">
        <HanziWriterTool />
      </div>
    </Layout>
  );
}
