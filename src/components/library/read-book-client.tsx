'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { type Book, moodData } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle, ChevronLeft, Gem, Clock5, Clock10 } from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { extractReadingForMood } from '@/ai/flows/extract-reading-for-mood';

type ReadBookClientProps = {
  book: Book | undefined;
};

export function ReadBookClient({ book }: ReadBookClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  
  const [passage, setPassage] = useState<string | null>(null);
  const [loadingDuration, setLoadingDuration] = useState<5 | 15 | null>(null);

  const handleGetPassage = async (duration: 5 | 15) => {
    if (!book) return;
    setLoadingDuration(duration);
    setPassage(null);

    const latestMood = moodData[moodData.length - 1]?.mood || 'neutral';

    try {
      const result = await extractReadingForMood({ 
        bookTitle: book.title,
        mood: latestMood,
        duration: duration
      });
      setPassage(result.passage);
    } catch (error) {
      console.error("Error extracting passage:", error);
      toast({
        variant: "destructive",
        title: "Error de Cero",
        description: "No se pudo obtener un pasaje en este momento. Por favor, inténtalo de nuevo más tarde.",
      });
    } finally {
      setLoadingDuration(null);
    }
  };

  if (!book) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold font-headline">Libro no encontrado</h2>
        <p className="text-muted-foreground mt-2">
          El libro que estás buscando no existe en la librería.
        </p>
        <Button asChild className="mt-6">
          <Link href="/dashboard/library">Volver a la librería</Link>
        </Button>
      </div>
    );
  }
  
  const isPassageLoading = loadingDuration !== null;

  return (
    <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ChevronLeft />
          Volver a la librería
        </Button>
        <Card>
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1 p-6 flex flex-col items-center text-center">
                    <div className="relative aspect-[2/3] w-full max-w-[200px] mb-4 shadow-lg rounded-lg overflow-hidden">
                        <Image
                            src={book.imageUrl}
                            alt={book.title}
                            data-ai-hint={book.imageHint}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <CardTitle className="font-headline text-2xl">{book.title}</CardTitle>
                    <CardDescription>{book.author}</CardDescription>
                </div>
                <div className="md:col-span-2 p-6 bg-muted/30 rounded-r-lg">
                    <h2 className="text-xl font-bold font-headline mb-2 flex items-center gap-2"><Gem/> Tu Espacio de Lectura</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                      Cero puede extraer un pasaje de este libro adaptado a tu estado de ánimo registrado.
                    </p>
                    
                    <ScrollArea className="h-[50vh] pr-4">
                        {isPassageLoading ? (
                            <div className="flex flex-col items-center justify-center text-center h-full p-8">
                                <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                                <p className="text-muted-foreground">Cero está buscando la mejor lectura para tu momento...</p>
                            </div>
                        ) : passage ? (
                            <p className="whitespace-pre-line text-muted-foreground leading-relaxed">
                                {passage}
                            </p>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center h-full border-2 border-dashed rounded-lg p-8 space-y-4">
                                <Gem className="h-10 w-10 text-primary" />
                                <h3 className="font-semibold text-lg">¿Listo para una dosis de sabiduría?</h3>
                                <p className="text-muted-foreground">Elige la duración de tu lectura:</p>
                                <div className="flex gap-4">
                                    <Button onClick={() => handleGetPassage(5)} disabled={isPassageLoading}>
                                        {loadingDuration === 5 ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <Clock5 className="mr-2 h-4 w-4" />
                                        )}
                                        Lectura de 5 min
                                    </Button>
                                    <Button onClick={() => handleGetPassage(15)} disabled={isPassageLoading}>
                                         {loadingDuration === 15 ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <Clock10 className="mr-2 h-4 w-4" />
                                        )}
                                        Lectura de 15 min
                                    </Button>
                                </div>
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </div>
        </Card>
    </div>
  );
}
