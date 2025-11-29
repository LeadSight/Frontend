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
  // DATA DUMMY DIKEMBALIKAN
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
      <BarChart accessibilityLayer data={data} barGap={4}>
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
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="contact1" fill="#a78bfa" radius={[4, 4, 0, 0]} />
        <Bar dataKey="contact2" fill="#a3e635" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}
