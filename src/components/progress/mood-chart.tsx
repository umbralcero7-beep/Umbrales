"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { moodData } from "@/lib/data"

const chartData = [
  { mood: "Feliz", count: moodData.filter(d => d.mood === "Feliz").length, fill: "var(--color-happy)" },
  { mood: "Calmado", count: moodData.filter(d => d.mood === "Calmado").length, fill: "var(--color-calm)" },
  { mood: "Pensativo", count: moodData.filter(d => d.mood === "Pensativo").length, fill: "var(--color-thoughtful)" },
  { mood: "Triste", count: moodData.filter(d => d.mood === "Triste").length, fill: "var(--color-sad)" },
  { mood: "Ansioso", count: moodData.filter(d => d.mood === "Ansioso").length, fill: "var(--color-anxious)" },
  { mood: "Cansado", count: moodData.filter(d => d.mood === "Cansado").length, fill: "var(--color-tired)" },
]

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
