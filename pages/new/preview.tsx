import { Layout } from "@/modules/layout";
import { PreviewContent } from "@/modules/new/preview";
import React from "react";

export default function Preview() {
  return (
    <Layout>
      <form className="max-md:px-4">
        <PreviewContent />
      </form>
    </Layout>
  );
}
