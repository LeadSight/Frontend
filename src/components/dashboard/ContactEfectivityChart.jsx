import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

const chartConfig = {
  success: { label: "Success", color: "#a78bfa" },
  failure: { label: "Failure", color: "#fca5a5" },
  other: { label: "Other", color: "#67e8f9" },
};

export function ContactEfectivityChart() {
  const data = [
    { name: "Celular", success: 166, failure: 119, other: 151 },
    { name: "Telephone", success: 143, failure: 184, other: 166 },
  ];

  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <BarChart accessibilityLayer data={data}>
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
        <Bar dataKey="success" fill="#a78bfa" radius={[4, 4, 0, 0]} />
        <Bar dataKey="failure" fill="#fca5a5" radius={[4, 4, 0, 0]} />
        <Bar dataKey="other" fill="#67e8f9" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}
