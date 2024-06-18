import { Layout } from "@/modules/layout";
import { NewReadingContent } from "@/modules/new";
import React from "react";

export default function Text() {
  return (
    <Layout>
      <form className="max-md:px-4">
        <NewReadingContent type="text" />
      </form>
    </Layout>
  );
}
