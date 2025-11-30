import React, { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

const chartConfig = {
  contact1: { label: "Contact 1", color: "#a78bfa" }, // UBAH JADI ENGLISH
  contact2: { label: "Contact 2", color: "#a3e635" }, // UBAH JADI ENGLISH
};

export function ContactDurationChart() {
  const allKeys = ["contact1", "contact2"];
  const [visibleKeys, setVisibleKeys] = useState(allKeys);

  const handleLegendClick = (key) => {
    if (visibleKeys.length === 1 && visibleKeys[0] === key) setVisibleKeys(allKeys);
    else setVisibleKeys([key]);
  };
  // DATA DUMMY
  const data = [
    { name: "1-2", contact1: 123, contact2: 112 },
    { name: "2-3", contact1: 110, contact2: 118 },
    { name: "3-4", contact1: 114, contact2: 108 },
    { name: "4-5", contact1: 143, contact2: 114 },
    { name: "5-6", contact1: 129, contact2: 110 },
    { name: "6-7", contact1: 121, contact2: 114 },
    { name: "7-8", contact1: 108, contact2: 103 },
    { name: "8-9", contact1: 112, contact2: 108 },
    { name: "9-10", contact1: 109, contact2: 139 },
  ];

  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <BarChart accessibilityLayer data={data} barGap={2} barSize={13} margin={{ top: 30, bottom: 7 }}>
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
        {(() => {
          const LegendWithDuration = (props) => (
            <div className="flex flex-col items-center mt-2">
              <div className="text-xs text-gray-500 mb-2">Duration</div>
              <ChartLegendContent {...props} onItemClick={handleLegendClick} activeKeys={visibleKeys} />
            </div>
          );

          return <ChartLegend content={<LegendWithDuration />} />;
        })()}
        {visibleKeys.includes("contact1") && (
          <Bar dataKey="contact1" fill="#a78bfa" radius={[0, 0, 0, 0]} />
        )}
        {visibleKeys.includes("contact2") && (
          <Bar dataKey="contact2" fill="#a3e635" radius={[0, 0, 0, 0]} />
        )}
      </BarChart>
    </ChartContainer>
  );
}
