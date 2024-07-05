import { Layout } from "@/modules/layout";
import React from "react";
import { PDFTool } from "@/modules/tools";

export default function PDFToolPage() {
  return (
    <Layout>
      <form className="max-md:px-4">
        <PDFTool />
      </form>
    </Layout>
  );
}
