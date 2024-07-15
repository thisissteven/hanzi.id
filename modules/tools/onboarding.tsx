import { Layout } from "@/modules/layout";
import React from "react";

import { CustomRouteButton } from "@/components";
import { BarChart3Icon, FileTextIcon, ImageUpIcon, PencilIcon, TypeIcon } from "lucide-react";
import { useLocale } from "@/locales/use-locale";

export function ToolsOnboarding() {
  const { t } = useLocale();

  const buttons: Array<{
    icon: React.ReactNode;
    text: string;
    path: string;
  }> = [
    {
      icon: <FileTextIcon />,
      text: t.tools.buttons[0],
      path: "/tools/pdf",
    },
    {
      icon: <ImageUpIcon />,
      text: t.tools.buttons[1],
      path: "/tools/images",
    },
    {
      icon: <TypeIcon />,
      text: t.tools.buttons[2],
      path: "/tools/count",
    },
    {
      icon: <PencilIcon />,
      text: t.tools.buttons[3],
      path: "/tools/hanzi-writer",
    },
    {
      icon: <BarChart3Icon />,
      text: t.tools.buttons[4],
      path: "/tools/analyzer",
    },
  ];

  return (
    <Layout>
      <div className="mt-4 px-2 md:px-4">
        <p className="mt-1 text-secondary">{t.tools.description}</p>
      </div>
      <div className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 gap-2">
        {buttons.map((button, index) => {
          return (
            <CustomRouteButton
              key={index}
              type="button"
              path={button.path}
              className="relative flex flex-col items-center text-left gap-2 border border-subtle hover:bg-hovered p-4 rounded-lg duration-200"
            >
              <span className="absolute left-3 top-2 text-secondary text-xs">{index + 1}</span>
              {button.icon}
              <span className="text-secondary">{button.text} &#8594;</span>
            </CustomRouteButton>
          );
        })}
      </div>
    </Layout>
  );
}
