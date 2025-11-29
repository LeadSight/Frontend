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
    color: "#fcd34d", // Kuning emas
  },
  last: {
    label: "Bulan Ini",
    color: "#2dd4bf", // Teal
  },
};

export function TrendChart({ data }) {
  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <LineChart
        accessibilityLayer
        data={data}
        margin={{ left: 12, right: 12 }}
      >
        <CartesianGrid vertical={false} stroke="#333" strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
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

        <Line
          dataKey="current"
          type="monotone"
          stroke="var(--color-current)"
          strokeWidth={3}
          dot={false}
        />
        <Line
          dataKey="last"
          type="monotone"
          stroke="var(--color-last)"
          strokeWidth={3}
          dot={false}
        />
        <ChartLegend
          content={<ChartLegendContent />}
          className="text-white mt-4"
        />
      </LineChart>
    </ChartContainer>
  );
}
