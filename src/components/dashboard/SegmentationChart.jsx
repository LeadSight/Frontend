import { Cell, Pie, PieChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

const chartConfig = {
  priority: { label: "Priority", color: "#fbbf24" },
  nonPriority: { label: "Not Priority", color: "#2dd4bf" },
  others: { label: "Others", color: "#a78bfa" },
};

// Fungsi untuk menghitung posisi teks di tengah slice
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const RADIAN = Math.PI / 180;
  // Menaruh label di tengah-tengah radius
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Hanya tampilkan jika persentasenya di atas 5% agar tidak menumpuk
  if (percent < 0.05) return null;

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-xs font-bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export function SegmentationChart({ data }) {
  const COLORS = ["#fbbf24", "#2dd4bf", "#a78bfa"];

  return (
    <div className="w-full h-full flex items-center justify-center min-h-[160px]">
      <ChartContainer
        config={chartConfig}
        className="w-[140px] h-[140px] xl:w-[170px] xl:h-[170px]"
      >
        <PieChart>
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={0}
            outerRadius="100%"
            strokeWidth={0}
            label={renderCustomizedLabel} // <--- TAMBAHKAN INI
            labelLine={false} // <--- Matikan garis penunjuk
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  );
}
