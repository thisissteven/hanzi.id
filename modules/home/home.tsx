import React from "react";
import { Layout } from "../layout";
import { HomeTodo } from "./todo";
import { LastRead } from "./last-read";

export function Home() {
  return (
    <Layout>
      <HomeTodo />

      <div className="mt-12">
        <LastRead />
      </div>
    </Layout>
  );
}
