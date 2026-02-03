'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { books as initialBooks, bookRecommendations, inProgressBooks, type Book } from "@/lib/data";
import { BookCard } from '@/components/library/book-card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const categories = ["Energía", "Reflexión", "Calma", "Crecimiento"];

export default function LibraryPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredBooks = initialBooks.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(search.toLowerCase()) || book.author.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory ? book.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Librería Emocional</h1>
        <p className="mt-1 text-muted-foreground max-w-lg">
          Un refugio digital con contenido curado para nutrir cada estado emocional.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por título o autor..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {categories.map(category => (
            <Button 
              key={category} 
              variant={selectedCategory === category ? "default" : "secondary"}
              onClick={() => setSelectedCategory(current => current === category ? null : category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="space-y-8">
        {inProgressBooks.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold font-headline mb-4">Continúa Leyendo</h2>
            <Carousel opts={{ align: "start", loop: false }} className="w-full">
              <CarouselContent>
                {inProgressBooks.map((book) => (
                  <CarouselItem key={book.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                    <BookCard book={book} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </div>
        )}

        {bookRecommendations.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold font-headline mb-4">Recomendado Para Ti</h2>
            <Carousel opts={{ align: "start", loop: false }} className="w-full">
              <CarouselContent>
                {bookRecommendations.map((book) => (
                  <CarouselItem key={book.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                    <BookCard book={book} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold font-headline mb-4">Explorar Todo</h2>
          {initialBooks.length > 0 ? (
            filteredBooks.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredBooks.map(book => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                  <p className="text-muted-foreground">No se encontraron libros. Intenta ajustar tu búsqueda.</p>
              </div>
            )
          ) : (
            <div className="text-center py-16">
                <p className="text-muted-foreground">No hay libros en la librería todavía.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
