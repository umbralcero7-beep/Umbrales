"use client"

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useHabits } from "@/hooks/use-habits"

const chartConfig = {
  completed: {
    label: "Completados",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function HabitChart() {
  const { history } = useHabits();

  const habitCompletionData = useMemo(() => {
    const data = [];
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      const dateString = date.toISOString().split('T')[0];
      const dayName = days[date.getDay()];
      
      const completedCount = history[dateString]?.length || 0;
      
      data.push({
        date: dayName,
        completed: completedCount,
      });
    }
    return data;
  }, [history]);
  
  const maxCompleted = Math.max(...habitCompletionData.map(d => d.completed), 1)

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={habitCompletionData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
         <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            allowDecimals={false}
            domain={[0, maxCompleted > 4 ? maxCompleted : 5]}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Bar dataKey="completed" fill="var(--color-completed)" radius={8} />
      </BarChart>
    </ChartContainer>
  )
}
