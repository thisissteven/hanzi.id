import { Layout } from "@/modules/layout";
import React from "react";
import { CharacterCountTool } from "@/modules/tools";

export default function CharacterCountToolPage() {
  return (
    <Layout>
      <form className="max-md:px-4">
        <CharacterCountTool />
      </form>
    </Layout>
  );
}
