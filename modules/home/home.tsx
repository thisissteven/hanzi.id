import React from "react";
import { Layout } from "../layout";
import { Divider } from "@/components";
import { Button, HyperLinkButton } from "./home-buttons";

export function Home() {
  return (
    <Layout>
      <h1 className="text-2xl md:text-3xl font-bold">What would you like to do today?</h1>

      <Divider />

      <div className="grid md:grid-cols-2 gap-4">
        <HyperLinkButton
          href="https://learn-hsk.vercel.app"
          title="Learn HSK 1-9"
          description="Chinese HSK vocabulary lists and practice exams."
        />

        <Button
          title="Immersed reading"
          description="Upload PDFs, texts or images to practice reading."
          onClick={() => {
            alert("Creating a new project...");
          }}
        />
      </div>

      <div className="mt-12">
        <h2 className="text-xl md:text-2xl font-semibold">Continue Reading</h2>
      </div>
    </Layout>
  );
}
