import { Layout } from "@/modules/layout";
import { PDFTool } from "@/modules/tools";
import React from "react";

export default function PDFToolPage() {
  return (
    <Layout>
      <div className="max-md:px-4">
        <PDFTool />
      </div>
    </Layout>
  );
}
