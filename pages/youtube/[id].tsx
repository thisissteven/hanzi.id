import React from "react";
import { BackRouteButton } from "@/components";
import { VideoIdContainer } from "@/modules/youtube/video-id-container";
import { Layout } from "@/modules/layout";

export default function Youtube() {
  return (
    <Layout>
      <div>
        <main className="max-w-[1080px] mx-auto md:px-8">
          <div className="flex flex-col justify-end bg-black z-10 max-md:px-2 pb-2 border-b-[1.5px] border-b-subtle">
            <div className="w-fit">
              <BackRouteButton />
            </div>
          </div>

          <VideoIdContainer />
        </main>
      </div>
    </Layout>
  );
}
