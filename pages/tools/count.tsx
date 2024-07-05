import { Layout } from "@/modules/layout";
import React from "react";
import { CharacterCountTool } from "@/modules/tools";

export default function CharacterCountToolPage() {
  return (
    <Layout>
      <div className="max-md:px-4">
        <CharacterCountTool />
      </div>
    </Layout>
  );
}
