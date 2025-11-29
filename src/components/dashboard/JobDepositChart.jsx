import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

const chartConfig = {
  deposit: { label: "Total Deposit", color: "#67e8f9" }, // Cyan
};

// UBAH: Terima props { data }
export function JobDepositChart({ data }) {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid
          vertical={false}
          strokeDasharray="3 3"
          stroke="#e5e7eb"
        />
        <XAxis
          dataKey="name" // Pastikan data yang dikirim punya key 'name'
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tick={{ fill: "#6b7280", fontSize: 12 }}
          // Opsional: Jika nama pekerjaan terlalu panjang, potong
          tickFormatter={(value) =>
            value.length > 10 ? `${value.slice(0, 10)}...` : value
          }
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#6b7280", fontSize: 12 }}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar
          dataKey="deposit" // Pastikan data yang dikirim punya key 'deposit'
          fill="#67e8f9"
          radius={[4, 4, 0, 0]}
          barSize={40}
        >
          <LabelList
            position="top"
            offset={12}
            className="fill-gray-600 text-xs"
            fontSize={12}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
