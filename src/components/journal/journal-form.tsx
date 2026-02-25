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
import { Loader2 } from "lucide-react";
import { useJournal } from "@/hooks/use-journal";
import { JournalAnalysis } from "./journal-analysis";

const formSchema = z.object({
  entry: z.string().min(50, "Tu entrada debe tener al menos 50 caracteres para ser analizada."),
});

const templates = [
    { name: "Gratitud", content: "Hoy estoy agradecido/a por:\n1. \n2. \n3. \n\n" },
    { name: "Logros", content: "Mis logros de hoy:\n- \n\nLo que me hizo sentir orgulloso/a:\n\n" },
    { name: "Aprendizaje", content: "La lección más importante de hoy fue:\n\nCómo la aplicaré mañana:\n\n" }
]

export function JournalForm() {
  const [analysis, setAnalysis] = useState<AnalyzeJournalEntryOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const { toast } = useToast();
  const { addJournalEntry } = useJournal();

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
      addJournalEntry(values.entry, result);
      setAnalysis(result);
      form.reset();
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
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">O empieza con una plantilla:</p>
                <div className="flex flex-wrap gap-2">
                    {templates.map(template => (
                        <Button key={template.name} type="button" size="sm" variant="outline" onClick={() => form.setValue('entry', template.content, { shouldValidate: true })}>
                            {template.name}
                        </Button>
                    ))}
                </div>
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar y Analizar
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
            <CardTitle className="font-headline">Análisis de tu Entrada Reciente</CardTitle>
            <CardDescription>Esto es lo que Cero encontró en tu última reflexión.</CardDescription>
          </CardHeader>
          <CardContent>
            <JournalAnalysis analysis={analysis} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
