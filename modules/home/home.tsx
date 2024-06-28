import React from "react";
import { Layout } from "../layout";
import { HomeTodo } from "./todo";

export function Home() {
  return (
    <Layout>
      <HomeTodo />

      {/* <div className="mt-12">
        <h2>FAQs</h2>
      </div> */}
    </Layout>
  );
}
