import { Cell, Pie, PieChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

const chartConfig = {
  success: { label: "Success", color: "#10b981" },
  failure: { label: "Failure", color: "#ef4444" },
  others: { label: "Others", color: "#6366f1" },
};

// Fungsi label yang sama
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
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

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

export function CampaignChart({ data }) {
  // Warna sesuai dengan Dashboard.jsx (Biru, Cyan, Orange, Abu)
  const COLORS = ["#6366f1", "#06b6d4", "#f59e0b", "#64748b"];

  return (
    <div className="w-full h-full flex items-center justify-center min-h-[160px]">
      <ChartContainer
        config={chartConfig}
        className="w-[140px] h-[140px] xl:w-[180px] xl:h-[180px]"
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
            labelLine={false}
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
