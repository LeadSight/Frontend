import React, { useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

const chartConfig = {
  current: {
    label: "Hari Ini",
    color: "#fcd34d",
  },
  last: {
    label: "Bulan Ini",
    color: "#2dd4bf",
  },
};

export function TrendChart({ data }) {
  const allKeys = ["current", "last"];
  const [visibleKeys, setVisibleKeys] = useState(allKeys);

  const handleLegendClick = (key) => {
    if (visibleKeys.length === 1 && visibleKeys[0] === key) setVisibleKeys(allKeys);
    else setVisibleKeys([key]);
  };

  return (
    <ChartContainer config={chartConfig} className="h-[350px] w-full">
      <LineChart
        accessibilityLayer
        data={data}
        margin={{ left: 12, right: 12, top : 20, bottom: 5 }}
      >
        <CartesianGrid vertical={false} stroke="#333" strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tickMargin={15}
          tick={{ fill: "#9ca3af" }}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#9ca3af" }}
          width={40}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

        {visibleKeys.includes("current") && (
          <Line
            dataKey="current"
            type="monotone"
            stroke="var(--color-current)"
            strokeWidth={3}
            dot={false}
          />
        )}
        {visibleKeys.includes("last") && (
          <Line
            dataKey="last"
            type="monotone"
            stroke="var(--color-last)"
            strokeWidth={3}
            dot={false}
          />
        )}
        <ChartLegend
          content={<ChartLegendContent onItemClick={handleLegendClick} activeKeys={visibleKeys} />}
          className="text-white mt-4"
        />
      </LineChart>
    </ChartContainer>
  );
}
