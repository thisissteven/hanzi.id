import React from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { useWindowSize } from "@/hooks";
import { cn } from "@/utils";
import { useLocale } from "@/locales/use-locale";

function numberWithCommas(x: number | string) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const legendText = {
  en: {
    idioms: "Idioms",
    words: "Words",
  },
  id: {
    idioms: "Idiom",
    words: "Kata",
  },
};

let timeout: NodeJS.Timeout;
export default function CategoryChart({
  data,
}: {
  data: Array<{
    name: string;
    idioms: number;
    words: number;
  }>;
}) {
  const { width } = useWindowSize();
  const { locale } = useLocale();
  if (width > 640) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart width={500} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity="var(--grid-opacity)" vertical={false} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            stroke="var(--axis-color)"
            fontSize={14}
            interval={0}
          />
          <YAxis axisLine={false} tickLine={false} stroke="var(--axis-color)" fontSize={14} />
          <Tooltip
            wrapperStyle={{ outline: "none" }}
            cursor={{ fill: "var(--chart-segment-fill)", opacity: "0.03" }}
            content={({ payload, label }) => {
              return (
                <div className="min-w-[8rem] divide-y rounded-md border shadow divide-secondary/10 border-secondary/10 bg-black text-secondary">
                  <p className="px-4 py-1.5">{label}</p>
                  <div>
                    <ul className="px-4 py-1.5">
                      {payload?.map((p, i) => {
                        return (
                          <li key={i} className="text-sm">
                            <svg
                              className={cn("mr-2 inline h-2 w-2")}
                              fill={i === 0 ? "var(--chart-primary)" : "var(--chart-secondary)"}
                              viewBox="0 0 8 8"
                            >
                              <circle cx={4} cy={4} r={4} />
                            </svg>
                            {numberWithCommas(p.value as string)}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              );
            }}
            position={{ y: 0 }}
          />
          <Legend
            layout="horizontal"
            verticalAlign="top"
            align="center"
            content={({ payload }) => {
              return (
                <ul className="flex w-fit gap-4 pb-6 pl-1">
                  {payload?.map((p, i) => (
                    <li key={i}>
                      <svg
                        className={cn("mr-2 inline h-2 w-2")}
                        fill={i === 0 ? "var(--chart-primary)" : "var(--chart-secondary)"}
                        viewBox="0 0 8 8"
                      >
                        <circle cx={4} cy={4} r={4} />
                      </svg>
                      {legendText[locale as "en" | "id"][p.value as "idioms" | "words"]}
                    </li>
                  ))}
                </ul>
              );
            }}
          />
          <Bar dataKey="idioms" fill="var(--chart-primary)" radius={[3, 3, 0, 0]} />
          <Bar dataKey="words" fill="var(--chart-secondary)" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  // Mobile screen size
  return (
    <div
      className="scrollbar -ml-4 w-[calc(100%+2.5rem)] flex-1 overflow-x-auto"
      onScroll={(e: React.UIEvent<HTMLDivElement>) => {
        clearTimeout(timeout);
        let ele = document.getElementsByClassName("recharts-yAxis")[0] as HTMLCollectionOf<HTMLElement>[number];

        if (!ele) return;

        const target = e.target as HTMLDivElement;
        ele.setAttribute("style", "transform: translateX(-20px);");
        ele.setAttribute("style", "opacity: 0;"),
          (timeout = setTimeout(() => {
            ele.setAttribute("style", "opacity: 100;");
            ele.setAttribute("style", "transform: translateX(" + target.scrollLeft + "px);");
          }, 500));
      }}
    >
      <BarChart
        width={500}
        height={275}
        data={data}
        margin={{
          bottom: 24,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity="var(--grid-opacity)" vertical={false} />
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          angle={-45}
          textAnchor="end"
          height={55}
          fontSize={13}
          stroke="var(--axis-color)"
          interval={0}
        />

        <Tooltip
          wrapperStyle={{ outline: "none" }}
          cursor={{ fill: "var(--chart-segment-fill)", opacity: "0.03" }}
          content={({ payload, label }) => {
            return (
              <div className="min-w-[8rem] divide-y rounded-md border shadow divide-secondary/10 border-secondary/10 bg-black text-secondary">
                <p className="px-4 py-1.5 text-sm">{label}</p>
                <div>
                  <ul className="px-4 py-1.5">
                    {payload?.map((p, i) => {
                      return (
                        <li key={i} className="text-xs">
                          <svg
                            className={cn("mr-2 inline h-2 w-2")}
                            fill={i === 0 ? "var(--chart-primary)" : "var(--chart-secondary)"}
                            viewBox="0 0 8 8"
                          >
                            <circle cx={4} cy={4} r={4} />
                          </svg>
                          {numberWithCommas(p.value as string)}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            );
          }}
          position={{ y: 0 }}
        />
        <Legend
          layout="horizontal"
          verticalAlign="top"
          align="center"
          content={({ payload }) => {
            return (
              <ul className="sticky left-3 flex w-fit gap-4 pb-6">
                {payload?.map((p, i) => (
                  <li key={i} className="text-sm">
                    <svg
                      className={cn("mr-2 inline h-2 w-2")}
                      fill={i === 0 ? "var(--chart-primary)" : "var(--chart-secondary)"}
                      viewBox="0 0 8 8"
                    >
                      <circle cx={4} cy={4} r={4} />
                    </svg>
                    {p.value}
                  </li>
                ))}
              </ul>
            );
          }}
        />
        <Bar dataKey="idioms" fill="var(--chart-primary)" radius={[3, 3, 0, 0]} />
        <Bar dataKey="words" fill="var(--chart-secondary)" radius={[3, 3, 0, 0]} />
        <YAxis axisLine={false} tickLine={false} fontSize={13} tick={{ dx: -7 }} stroke="var(--axis-color)" />
      </BarChart>
    </div>
  );
}
