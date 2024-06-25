import React from "react";
import { Layout } from "@/modules/layout";
import { Explore } from "@/modules/home/explore";
import { BackRouteButton } from "@/components";

export default function ExplorePage() {
  return (
    <Layout>
      <div className="min-h-dvh">
        <main className="max-w-[960px] mx-auto md:px-8 pb-4">
          <div className="max-md:sticky top-0 h-[11.25rem] flex flex-col justify-end bg-black z-10 max-md:px-2 pb-2 border-b-[1.5px] border-b-subtle">
            <div className="w-fit">
              <BackRouteButton />
            </div>
          </div>

          <Explore />
        </main>
      </div>
    </Layout>
  );
}
