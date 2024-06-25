import React from "react";
import { Layout } from "../layout";
import { HomeTodo } from "./todo";

export function Home() {
  return (
    <Layout>
      <HomeTodo />

      {/* <div className="mt-12">
        <Explore />
      </div> */}
    </Layout>
  );
}
