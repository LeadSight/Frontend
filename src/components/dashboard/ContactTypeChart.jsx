import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

const chartConfig = {
  jumlah: { label: "Total", color: "#3b82f6" }, // UBAH JADI ENGLISH ("Total" atau "Count")
};

export function ContactTypeChart() {
  // DATA DUMMY DIKEMBALIKAN
  const data = [
    { name: "Celular", jumlah: 160 },
    { name: "Telephone", jumlah: 136 },
  ];

  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <BarChart accessibilityLayer data={data} barSize={80}>
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
        <Bar dataKey="jumlah" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}
