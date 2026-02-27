"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { GetAdviceForMoodOutput } from "@/ai/flows/get-advice-for-mood";

const CeroIcon = ({ className }: { className?: string }) => (
    <div className={cn("relative text-primary", className)}>
        <svg
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute h-full w-full animate-spin-slow"
        >
            <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray="230"
                strokeDashoffset="75"
            />
        </svg>
        <svg
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full"
        >
            <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                opacity="0.2"
            />
            <circle
                cx="50"
                cy="50"
                r="30"
                fill="currentColor"
            />
        </svg>
    </div>
);

type TodaysInsightProps = {
  insight: GetAdviceForMoodOutput;
};

export function TodaysInsight({ insight }: TodaysInsightProps) {
  return (
    <Card className="w-full max-w-2xl text-center">
      <CardHeader className="flex flex-col items-center gap-3 space-y-0 pb-4">
        <div className="p-3 bg-primary/10 rounded-full">
            <CeroIcon className="h-8 w-8" />
        </div>
        <div>
            <CardTitle className="font-headline text-xl">Tu Mensaje de Hoy</CardTitle>
            <CardDescription>Un pensamiento de Cero basado en cómo te sientes.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="min-h-[100px] flex items-center justify-center">
        <div className="space-y-4 text-center">
            <p className="font-medium">{insight.advice}</p>
            <blockquote className="border-l-2 border-primary pl-4 text-left italic">
                <p className="text-muted-foreground">"{insight.quote}"</p>
                <footer className="mt-2 text-xs not-italic font-medium text-right text-primary">
                &mdash; {insight.bookTitle}
                </footer>
            </blockquote>
        </div>
      </CardContent>
    </Card>
  );
}
