import React, { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

const chartConfig = {
  success: { label: "Success", color: "#a78bfa" },
  failure: { label: "Failure", color: "#C21111" },
  other: { label: "Other", color: "#E5E7EB" },
};

export function ContactEfectivityChart() {
  const data = [
    { name: "Celular", success: 166, failure: 119, other: 151 },
    { name: "Telephone", success: 143, failure: 184, other: 166 },
  ];

  const allKeys = ["success", "failure", "other"];
  const [visibleKeys, setVisibleKeys] = useState(allKeys);

  const handleLegendClick = (key) => {
    if (visibleKeys.length === 1 && visibleKeys[0] === key) {
      setVisibleKeys(allKeys); // restore all
    } else {
      setVisibleKeys([key]);
    }
  };

  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <BarChart accessibilityLayer data={data} barSize={50} margin={{ top: 30, bottom: 5 }}>
        <CartesianGrid
          vertical={false}
          strokeDasharray="3 3"
          stroke="#e5e7eb"
        />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tick={{ fontSize: 12, fill: "#6b7280" }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12, fill: "#6b7280" }}
          label={{ value: 'Frequency', angle: -90, position: 'insideLeft', dx: 0, fill: '#6b7280', style: { fontSize: 12 } }}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent onItemClick={handleLegendClick} activeKeys={visibleKeys} />} />
        {visibleKeys.includes("success") && (
          <Bar dataKey="success" fill="#a78bfa" radius={[0, 0, 0, 0]}>
            <LabelList position="top" offset={8} className="fill-gray-600 text-xs" />
          </Bar>
        )}
        {visibleKeys.includes("failure") && (
          <Bar dataKey="failure" fill="#C21111" radius={[0, 0, 0, 0]}>
            <LabelList position="top" offset={8} className="fill-gray-600 text-xs" />
          </Bar>
        )}
        {visibleKeys.includes("other") && (
          <Bar dataKey="other" fill="#E5E7EB" radius={[0, 0, 0, 0]}>
            <LabelList position="top" offset={8} className="fill-gray-600 text-xs" />
          </Bar>
        )}
      </BarChart>
    </ChartContainer>
  );
}
