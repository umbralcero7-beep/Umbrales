"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { habitCompletionData } from "@/lib/data"

const chartConfig = {
  completed: {
    label: "Completados",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function HabitChart() {
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
            domain={[0, 5]}
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
