"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getDailyQuote } from "@/ai/flows/get-daily-quote";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type DailyMessageData = {
  quote: string;
  bookTitle: string;
};

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

const CACHE_KEY = 'dailyCeroMessage';

export function DailyMessage() {
  const [data, setData] = useState<DailyMessageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getDailyMessage() {
      const today = new Date().toDateString();

      try {
        const cachedItem = localStorage.getItem(CACHE_KEY);
        if (cachedItem) {
          const { data: cachedData, date } = JSON.parse(cachedItem);
          if (date === today) {
            setData(cachedData);
            setLoading(false);
            return; // Valid cache for today found, we're done.
          }
        }
      } catch (e) {
        console.error("Failed to parse daily message cache, will refetch.", e);
      }

      // If we're here, cache is invalid or missing. Time to fetch.
      setLoading(true);
      setError(null);

      try {
        const result = await getDailyQuote();
        setData(result);
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data: result, date: today }));
      } catch (error: any) {
        let userMessage = "No se pudo obtener la frase del día. Por favor, inténtalo de nuevo más tarde.";
        if (error?.message?.includes('429')) {
            userMessage = "Has superado la cuota de la API de IA. La frase del día se mostrará mañana.";
        }
        setError(userMessage);
        console.error("Error fetching daily quote:", error);
      } finally {
        setLoading(false);
      }
    }
    
    getDailyMessage();
    
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <Card className="w-full max-w-2xl text-center">
      <CardHeader className="flex flex-col items-center gap-3 space-y-0 pb-4">
        <div className="p-3 bg-primary/10 rounded-full">
            <CeroIcon className="h-8 w-8" />
        </div>
        <div>
            <CardTitle className="font-headline text-xl">Un Mensaje Diario de Cero</CardTitle>
            <CardDescription>Tu compañero IA de bienestar.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="min-h-[100px] flex items-center justify-center">
        {loading ? (
          <div className="space-y-2 pt-2 flex flex-col items-center w-full">
            <Skeleton className="h-4 w-10/12" />
            <Skeleton className="h-4 w-8/12" />
            <Skeleton className="h-4 w-4/12" />
          </div>
        ) : error ? (
            <div className="text-center text-destructive space-y-2 flex flex-col items-center">
                <AlertTriangle className="h-6 w-6" />
                <p className="font-semibold">¡Oh, no! Algo salió mal.</p>
                <p className="text-sm text-destructive/80">{error}</p>
            </div>
        ) : data ? (
            <blockquote className="space-y-2">
                <p className="border-l-2 border-primary pl-4 pr-2 text-left italic text-muted-foreground">
                    "{data.quote}"
                </p>
                <footer className="text-xs not-italic font-medium text-right text-primary pr-2">
                    &mdash; {data.bookTitle}
                </footer>
            </blockquote>
        ) : null}
      </CardContent>
    </Card>
  );
}
