"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Sparkles } from "lucide-react";
import { moodData } from "@/lib/data";
import { analyzeMoodPatterns } from "@/ai/flows/analyze-mood-patterns";

export function MoodAnalysis() {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getAnalysis() {
      if (moodData.length === 0) {
        setAnalysis("Registra tu estado de ánimo durante unos días para que Cero pueda darte un análisis personalizado.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const result = await analyzeMoodPatterns({ moodHistory: moodData });
        setAnalysis(result.analysis);
      } catch (error: any) {
        let userMessage = "No se pudo obtener el análisis en este momento.";
        if (error?.message?.includes('429')) {
            userMessage = "Has alcanzado el límite de la API. El análisis estará disponible más tarde.";
        }
        setError(userMessage);
        console.error("Error fetching mood analysis:", error);
      } finally {
        setLoading(false);
      }
    }
    
    getAnalysis();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary"/>
            Análisis de Cero
        </CardTitle>
        <CardDescription>Perspectivas de tu compañero de IA sobre tus patrones de ánimo.</CardDescription>
      </CardHeader>
      <CardContent className="min-h-[200px] flex items-center justify-center">
        {loading ? (
          <div className="space-y-2 w-full">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-10/12" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : error ? (
            <div className="text-center text-destructive space-y-2 flex flex-col items-center p-4">
                <AlertTriangle className="h-6 w-6" />
                <p className="font-semibold">Error de Análisis</p>
                <p className="text-sm text-destructive/80">{error}</p>
            </div>
        ) : analysis ? (
            <p className="text-sm text-muted-foreground italic">
                "{analysis}"
            </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
