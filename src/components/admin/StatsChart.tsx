// src/components/admin/StatsChart.tsx
"use client";

import { useTheme } from "next-themes";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface StatsChartProps {
  data: { name: string; products: number; workshops: number }[];
}

export default function StatsChart({ data }: StatsChartProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const gridColor = isDark ? "#3d322a" : "#e5e7eb";
  const axisColor = isDark ? "#b5a392" : "#6b5a45";
  const tooltipBg = isDark ? "#1a1410" : "#ffffff";
  const tooltipBorder = isDark ? "#3d322a" : "#ede6db";
  const tooltipText = isDark ? "#f5efe8" : "#2C2416";

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="name" stroke={axisColor} fontSize={12} />
          <YAxis stroke={axisColor} fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBg,
              border: `1px solid ${tooltipBorder}`,
              borderRadius: "8px",
              fontFamily: "var(--font-nunito)",
              color: tooltipText,
            }}
            labelStyle={{ color: tooltipText }}
            itemStyle={{ color: tooltipText }}
          />
          <Legend />
          <Bar dataKey="products" fill="#FFB5A0" radius={[4, 4, 0, 0]} />
          <Bar dataKey="workshops" fill="#A8D8C8" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}