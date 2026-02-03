"use client"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { habitConsistencyData } from "@/lib/data";

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-bold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export function HabitConsistencyChart() {
    return (
        <ResponsiveContainer width="100%" height={250}>
            <PieChart>
                <Pie
                    data={habitConsistencyData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={100}
                    dataKey="habits"
                    nameKey="name"
                    strokeWidth={2}
                >
                    {habitConsistencyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} stroke={entry.fill} />
                    ))}
                </Pie>
                <Legend wrapperStyle={{fontSize: "14px"}}/>
            </PieChart>
        </ResponsiveContainer>
    );
}
