"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useMood } from "@/hooks/use-mood"

const chartConfig = {
  count: {
    label: "Días",
  },
  happy: {
    label: "Feliz",
    color: "hsl(var(--chart-2))",
  },
  calm: {
    label: "Calmado",
    color: "hsl(var(--chart-1))",
  },
  sad: {
    label: "Triste",
    color: "hsl(var(--chart-3))",
  },
  anxious: {
    label: "Ansioso",
    color: "hsl(var(--chart-5))",
  },
  tired: {
    label: "Cansado",
    color: "hsl(var(--chart-4))",
  },
  thoughtful: {
    label: "Pensativo",
    color: "hsl(var(--accent))",
  }
} satisfies ChartConfig

export function MoodChart() {
  const { moods: moodLogs } = useMood();

  const chartData = [
    { mood: "Feliz", count: moodLogs.filter(d => d.mood === "Feliz").length, fill: "var(--color-happy)" },
    { mood: "Calmado", count: moodLogs.filter(d => d.mood === "Calmado").length, fill: "var(--color-calm)" },
    { mood: "Pensativo", count: moodLogs.filter(d => d.mood === "Pensativo").length, fill: "var(--color-thoughtful)" },
    { mood: "Triste", count: moodLogs.filter(d => d.mood === "Triste").length, fill: "var(--color-sad)" },
    { mood: "Ansioso", count: moodLogs.filter(d => d.mood === "Ansioso").length, fill: "var(--color-anxious)" },
    { mood: "Cansado", count: moodLogs.filter(d => d.mood === "Cansado").length, fill: "var(--color-tired)" },
  ]
  const maxCount = Math.max(...chartData.map(d => d.count), 1);

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="mood"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
         <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            allowDecimals={false}
            domain={[0, maxCount > 4 ? maxCount : 5]}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Bar dataKey="count" radius={8} />
      </BarChart>
    </ChartContainer>
  )
}
