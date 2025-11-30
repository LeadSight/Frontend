import React, { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

const chartConfig = {
  kontak1: { label: "Contact 1", color: "#a78bfa" },
  kontak2: { label: "Contact 2", color: "#fca5a5" },
};

export function ContactDistributionChart() {
  const allKeys = ["kontak1", "kontak2"];
  const [visibleKeys, setVisibleKeys] = useState(allKeys);

  const handleLegendClick = (key) => {
    if (visibleKeys.length === 1 && visibleKeys[0] === key) setVisibleKeys(allKeys);
    else setVisibleKeys([key]);
  };
  
  // DATA DUMMY
  const data = [
    { name: "Jan", kontak1: 140, kontak2: 120 },
    { name: "Feb", kontak1: 120, kontak2: 110 },
    { name: "Mar", kontak1: 150, kontak2: 130 },
    { name: "Apr", kontak1: 110, kontak2: 120 },
    { name: "May", kontak1: 90, kontak2: 160 },
    { name: "Jun", kontak1: 110, kontak2: 130 },
    { name: "Jul", kontak1: 170, kontak2: 110 },
    { name: "Aug", kontak1: 165, kontak2: 100 },
    { name: "Sep", kontak1: 170, kontak2: 170 },
    { name: "Oct", kontak1: 90, kontak2: 160 },
    { name: "Nov", kontak1: 110, kontak2: 160 },
    { name: "Des", kontak1: 110, kontak2: 160 },
  ];

  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <AreaChart accessibilityLayer data={data} margin={{ top: 30, bottom: 5 }}>
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
          // Y-axis description label
          label={{ value: 'Frequency', angle: -90, position: 'insideLeft', dx: 0, fill: '#6b7280', style: { fontSize: 12 } }}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent onItemClick={handleLegendClick} activeKeys={visibleKeys} />} />
        {visibleKeys.includes("kontak1") && (
          <Area
          type="monotone"
          dataKey="kontak1"
          stroke="#a78bfa"
          fill="#a78bfa"
          fillOpacity={0.3}
          />
        )}
        {visibleKeys.includes("kontak2") && (
          <Area
            type="monotone"
            dataKey="kontak2"
            stroke="#fca5a5"
            fill="#fca5a5"
            fillOpacity={0.3}
          />
        )}
      </AreaChart>
    </ChartContainer>
  );
}
