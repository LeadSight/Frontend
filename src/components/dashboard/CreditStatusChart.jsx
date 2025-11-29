import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

const chartConfig = {
  macet: { label: "Macet (Default)", color: "#8b5cf6" }, // Ungu
  lancar: { label: "Lancar", color: "#fca5a5" }, // Pink
};

// UBAH: Terima props { data }
export function CreditStatusChart({ data }) {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <BarChart accessibilityLayer data={data} barGap={8}>
        <CartesianGrid
          vertical={false}
          strokeDasharray="3 3"
          stroke="#e5e7eb"
        />
        <XAxis
          dataKey="name" // Label Range (misal: 0-500, 500-1k)
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tick={{ fill: "#6b7280", fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#6b7280", fontSize: 12 }}
        />
        <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />
        <ChartLegend content={<ChartLegendContent />} />

        {/* Bar untuk Macet */}
        <Bar
          dataKey="macet"
          fill="#8b5cf6"
          radius={[4, 4, 0, 0]}
          barSize={20}
        />
        {/* Bar untuk Lancar */}
        <Bar
          dataKey="lancar"
          fill="#fca5a5"
          radius={[4, 4, 0, 0]}
          barSize={20}
        />
      </BarChart>
    </ChartContainer>
  );
}
