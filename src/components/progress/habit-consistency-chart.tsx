"use client"
import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { useHabits } from "@/hooks/use-habits";

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (!percent || percent === 0) return null;
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
    const { habits, history } = useHabits();

    const habitConsistencyData = useMemo(() => {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const daysInMonthSoFar = today.getDate();
        
        let totalCompletions = 0;
        
        for (let i = 0; i < daysInMonthSoFar; i++) {
            const date = new Date(firstDayOfMonth);
            date.setDate(firstDayOfMonth.getDate() + i);
            const dateString = date.toISOString().split('T')[0];
            totalCompletions += history[dateString]?.length || 0;
        }

        const totalPossibleCompletions = habits.length * daysInMonthSoFar;
        const pending = totalPossibleCompletions - totalCompletions;

        if (totalPossibleCompletions === 0) {
            return [
                { name: 'Completados', habits: 0, fill: 'hsl(var(--chart-2))' },
                { name: 'Pendientes', habits: 1, fill: 'hsl(var(--destructive))' },
            ]
        }

        return [
            { name: 'Completados', habits: totalCompletions, fill: 'hsl(var(--chart-2))' },
            { name: 'Pendientes', habits: pending > 0 ? pending : 0, fill: 'hsl(var(--destructive))' },
        ];
    }, [habits, history]);

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
