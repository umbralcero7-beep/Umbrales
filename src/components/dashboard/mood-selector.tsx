'use client';

import { useState } from 'react';
import { moods } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getAdviceForMood, type GetAdviceForMoodOutput } from '@/ai/flows/get-advice-for-mood';
import { extractReadingForMood } from '@/ai/flows/extract-reading-for-mood';
import { Loader2, AlertTriangle, Gem } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';

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

export function MoodSelector() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [advice, setAdvice] = useState<GetAdviceForMoodOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [step, setStep] = useState<'write' | 'advice'>('write');
  const [journalText, setJournalText] = useState('');
  const { toast } = useToast();
  
  const [selectedBookTitle, setSelectedBookTitle] = useState<string | null>(null);
  const [isReadingDialogOpen, setIsReadingDialogOpen] = useState(false);
  const [isReadingLoading, setIsReadingLoading] = useState(false);
  const [readingPassage, setReadingPassage] = useState<string | null>(null);

  const handleMoodSelect = (moodName: string) => {
    setSelectedMood(moodName);
    setStep('write');
    setJournalText('');
    setAdvice(null);
    setError(null);
    setIsDialogOpen(true);
  };

  const handleContinueFromWriting = async () => {
    if (!selectedMood) return;

    if (journalText.trim().length > 10) {
      // Here you would typically save the entry to your backend
      console.log("Journal entry to save:", journalText);
      toast({
        title: "Entrada de diario guardada",
        description: "Tus pensamientos han sido registrados.",
      });
    }

    setStep('advice');
    setIsLoading(true);
    setError(null);

    try {
      const result = await getAdviceForMood({ mood: selectedMood });
      setAdvice(result);
      setSelectedBookTitle(result.bookTitle);

       toast({
        title: "¡Estado de ánimo registrado!",
        description: `Has registrado tu estado de ánimo como: ${selectedMood}`,
      })
    } catch (error: any) {
        let userMessage = "No se pudo obtener un consejo en este momento. Por favor, inténtalo de nuevo.";
        if (error?.message?.includes('429')) {
            userMessage = "Has superado la cuota de la API de IA. Por favor, inténtalo de nuevo más tarde.";
        }
        setError(userMessage);
        console.error("Error fetching advice for mood:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReadPassage = async () => {
    if (!selectedBookTitle || !selectedMood) return;

    setIsDialogOpen(false);
    setIsReadingDialogOpen(true);
    setIsReadingLoading(true);
    setReadingPassage(null);

    try {
      const { passage } = await extractReadingForMood({ mood: selectedMood, bookTitle: selectedBookTitle });
      setReadingPassage(passage);
    } catch (error: any) {
      if (error?.message?.includes('429')) {
        console.log("AI rate limit hit for reading passage. Using fallback.");
        toast({
          variant: "destructive",
          title: "Límite de IA alcanzado",
          description: "No se pudo obtener la lectura en este momento. Por favor, inténtalo de nuevo más tarde.",
        });
      } else {
        console.error("Error extracting reading:", error);
        toast({
          variant: "destructive",
          title: "Error de Cero",
          description: "No se pudo obtener la lectura en este momento.",
        });
      }
      setIsReadingDialogOpen(false);
    } finally {
      setIsReadingLoading(false);
    }
  };

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setSelectedMood(null);
      setStep('write');
      setJournalText('');
      setSelectedBookTitle(null);
      setError(null);
    }
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-4 w-full max-w-sm mx-auto">
        {moods.map((mood) => {
          const isSelected = selectedMood === mood.name;
          return (
            <Card
              key={mood.name}
              className={cn(
                "cursor-pointer bg-card hover:bg-muted transition-colors",
                isSelected && isDialogOpen && "ring-2 ring-primary"
              )}
              onClick={() => handleMoodSelect(mood.name)}
            >
              <CardContent className="flex flex-col items-center justify-center gap-2 p-4 aspect-square">
                <span className="text-4xl">{mood.emoji}</span>
                <span className="font-medium text-sm">{mood.name}</span>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <AlertDialog open={isDialogOpen} onOpenChange={handleDialogChange}>
        <AlertDialogContent>
          {step === 'write' ? (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>Te sientes {selectedMood?.toLowerCase()}.</AlertDialogTitle>
                <AlertDialogDescription>
                  Tómate un momento para explorar por qué te sientes así. ¿Qué ha pasado hoy?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="mood-entry" className="sr-only">
                  ¿Por qué te sientes así?
                </Label>
                <Textarea 
                  placeholder="Escribe tus pensamientos aquí..." 
                  id="mood-entry"
                  value={journalText}
                  onChange={(e) => setJournalText(e.target.value)} 
                  className="min-h-[120px]"
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Omitir</AlertDialogCancel>
                <AlertDialogAction onClick={handleContinueFromWriting}>Continuar</AlertDialogAction>
              </AlertDialogFooter>
            </>
          ) : (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <CeroIcon className="h-6 w-6" />
                  Un Mensaje de Cero
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Gracias por compartir cómo te sientes. Aquí tienes un pensamiento para ti.
                </AlertDialogDescription>
              </AlertDialogHeader>
              
              <div className="min-h-[120px] flex items-center justify-center my-4">
                {isLoading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Cero está buscando un consejo para ti...</p>
                  </div>
                ) : error ? (
                    <div className="text-center text-destructive space-y-2 flex flex-col items-center">
                        <AlertTriangle className="h-8 w-8" />
                        <p className="font-semibold">¡Oh, no! Algo salió mal.</p>
                        <p className="text-sm text-destructive/80">{error}</p>
                    </div>
                ) : advice ? (
                  <div className="space-y-4 text-center">
                    <p className="font-medium">{advice.advice}</p>
                    <blockquote className="border-l-2 border-primary pl-4 text-left italic">
                      <p className="text-muted-foreground">"{advice.quote}"</p>
                      <footer className="mt-2 text-xs not-italic font-medium text-right text-primary">
                        &mdash; {advice.bookTitle}
                      </footer>
                    </blockquote>
                  </div>
                ) : null}
              </div>

              <AlertDialogFooter className="sm:justify-between sm:flex-row-reverse w-full gap-2">
                <AlertDialogAction onClick={() => setIsDialogOpen(false)}>Cerrar</AlertDialogAction>
                {advice && !error && selectedBookTitle && (
                    <Button variant="outline" onClick={handleReadPassage}>
                        <Gem className="mr-2" />
                        Buscar Pepita de Oro
                    </Button>
                )}
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isReadingDialogOpen} onOpenChange={setIsReadingDialogOpen}>
        <AlertDialogContent className="sm:max-w-2xl h-[90vh] flex flex-col">
            <AlertDialogHeader>
                <AlertDialogTitle>Lectura de 5 minutos</AlertDialogTitle>
                <AlertDialogDescription>
                    Un pasaje de "{selectedBookTitle}" para tu momento.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <ScrollArea className="flex-1 -mx-6 px-6">
                <div className="py-4 pr-4">
                {isReadingLoading ? (
                    <div className="flex flex-col items-center justify-center text-center h-full p-8">
                        <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                        <p className="text-muted-foreground">Cero está buscando la mejor lectura para tu estado de ánimo...</p>
                    </div>
                ) : (
                    <p className="whitespace-pre-line text-sm text-foreground/80 leading-relaxed">
                        {readingPassage}
                    </p>
                )}
                </div>
            </ScrollArea>
            <AlertDialogFooter>
                <Button onClick={() => setIsReadingDialogOpen(false)}>Terminar Lectura</Button>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
