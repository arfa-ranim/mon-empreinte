// src/components/admin/StatsChart.tsx
"use client";

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
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" stroke="#6b5a45" fontSize={12} />
          <YAxis stroke="#6b5a45" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #ede6db",
              borderRadius: "8px",
              fontFamily: "var(--font-nunito)",
            }}
          />
          <Legend />
          <Bar dataKey="products" fill="#FFB5A0" radius={[4, 4, 0, 0]} />
          <Bar dataKey="workshops" fill="#A8D8C8" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}