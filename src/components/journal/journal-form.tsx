"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { analyzeJournalEntry, type AnalyzeJournalEntryOutput } from "@/ai/flows/analyze-journal-entry";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Loader2, ListTree, Smile, Sparkles, Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  entry: z.string().min(50, "Tu entrada debe tener al menos 50 caracteres para ser analizada."),
});

export function JournalForm() {
  const [analysis, setAnalysis] = useState<AnalyzeJournalEntryOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { entry: "" },
  });

  useEffect(() => {
    const name = localStorage.getItem('userName');
    if (name) {
      setUserName(name);
    }
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAnalysis(null);
    try {
      const result = await analyzeJournalEntry({ 
        entryText: values.entry,
        userName: userName || 'tú'
      });
      setAnalysis(result);
      toast({
        title: "Análisis Completo",
        description: "Cero ha analizado tu entrada de diario.",
      });
    } catch (error) {
      console.error("Error en el análisis del diario:", error);
      toast({
        variant: "destructive",
        title: "Análisis Fallido",
        description: "Hubo un error analizando tu entrada. Por favor, inténtalo de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Nueva Entrada de Diario</CardTitle>
          <CardDescription>
            Escribe tus pensamientos y sentimientos. Cero puede ayudarte a encontrar claridad.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="entry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Entrada de Diario</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="¿Qué tienes en mente hoy?"
                        className="min-h-[200px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Analizar Entrada
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
         <Card>
            <CardHeader>
              <CardTitle className="font-headline">Analizando tus pensamientos...</CardTitle>
              <CardDescription>Cero está procesando tu entrada para encontrar ideas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-8 w-1/2 rounded-md bg-muted animate-pulse"></div>
              <div className="h-20 w-full rounded-md bg-muted animate-pulse"></div>
              <div className="h-20 w-full rounded-md bg-muted animate-pulse"></div>
            </CardContent>
          </Card>
      )}

      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Análisis de Cero</CardTitle>
            <CardDescription>Esto es lo que Cero encontró en tu entrada.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="flex items-center text-lg font-semibold mb-2"><Smile className="mr-2 h-5 w-5 text-primary" /> Sentimiento General</h3>
              <Badge variant="outline">{analysis.sentiment}</Badge>
            </div>
            <Separator />
            <div>
              <h3 className="flex items-center text-lg font-semibold mb-2"><Lightbulb className="mr-2 h-5 w-5 text-primary" /> Temas Clave</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.topics.map((topic) => (
                  <Badge key={topic} variant="secondary">{topic}</Badge>
                ))}
              </div>
            </div>
            <Separator />
             <div>
              <h3 className="flex items-center text-lg font-semibold mb-2"><ListTree className="mr-2 h-5 w-5 text-primary" /> Patrones Potenciales</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                {analysis.patterns.map((pattern, index) => (
                    <li key={index}>{pattern}</li>
                ))}
              </ul>
            </div>
            <Separator />
            <div>
                <h3 className="flex items-center text-lg font-semibold mb-2"><Star className="mr-2 h-5 w-5 text-primary" /> Resumen</h3>
                <p className="text-muted-foreground">{analysis.summary}</p>
            </div>
            <Separator />
            <div>
              <h3 className="flex items-center text-lg font-semibold mb-2"><Sparkles className="mr-2 h-5 w-5 text-primary" /> Sugerencia de Cero</h3>
              <p className="text-muted-foreground">{analysis.suggestedAction}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
