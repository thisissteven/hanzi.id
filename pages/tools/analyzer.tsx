import { Layout } from "@/modules/layout";
import React from "react";
import { AnalyzerTool } from "@/modules/tools";

export default function AnalyzerToolPage() {
  return (
    <Layout>
      <div className="max-md:px-4">
        <AnalyzerTool />
      </div>
    </Layout>
  );
}
