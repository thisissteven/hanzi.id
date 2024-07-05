import { Layout } from "@/modules/layout";
import React from "react";
import { ToolsOnboarding } from "@/modules/tools";

export default function Tools() {
  return (
    <Layout>
      <form className="max-md:px-4">
        <ToolsOnboarding />
      </form>
    </Layout>
  );
}
