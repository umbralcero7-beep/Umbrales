'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { type Book } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle, ChevronLeft, BookOpen, Sparkles } from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { extractBookPassage } from '@/ai/flows/extract-book-passage';
import { Skeleton } from '@/components/ui/skeleton';

type ReadBookClientProps = {
  book: Book | undefined;
};

export function ReadBookClient({ book }: ReadBookClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  
  const [passage, setPassage] = useState<string | null>(null);
  const [isPassageLoading, setIsPassageLoading] = useState(false);

  const handleGetPassage = async () => {
    if (!book) return;
    setIsPassageLoading(true);
    setPassage(null);
    try {
      const result = await extractBookPassage({ bookTitle: book.title });
      setPassage(result.passage);
    } catch (error) {
      console.error("Error extracting passage:", error);
      toast({
        variant: "destructive",
        title: "Error de Cero",
        description: "No se pudo obtener un pasaje en este momento. Por favor, inténtalo de nuevo más tarde.",
      });
    } finally {
      setIsPassageLoading(false);
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

  return (
    <div className="h-full max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
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
                    <h2 className="text-xl font-bold font-headline mb-4 flex items-center gap-2"><BookOpen/> Tu Espacio de Lectura</h2>
                    
                    {passage || isPassageLoading ? (
                        <ScrollArea className="h-[50vh] pr-4">
                            {isPassageLoading ? (
                                <div className="space-y-4">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-11/12" />
                                    <Skeleton className="h-4 w-full" />
                                    <br/>
                                    <Skeleton className="h-4 w-10/12" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-9/12" />
                                </div>
                            ) : (
                                <p className="whitespace-pre-line text-muted-foreground leading-relaxed">
                                    {passage}
                                </p>
                            )}
                        </ScrollArea>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center h-[50vh] border-2 border-dashed rounded-lg p-8">
                            <Sparkles className="h-10 w-10 text-primary mb-4" />
                            <h3 className="font-semibold text-lg">¿Listo para una dosis de sabiduría?</h3>
                            <p className="text-muted-foreground mb-4">Cero puede extraer un pasaje clave de 5 minutos de este libro para ti.</p>
                            <Button onClick={handleGetPassage} disabled={isPassageLoading}>
                                {isPassageLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Sparkles className="mr-2 h-4 w-4" />
                                )}
                                Leer un pasaje de 5 minutos
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    </div>
  );
}
