'use client';

import Image from 'next/image';
import Link from 'next/link';
import { type Book } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';

export function BookCard({ book }: { book: Book }) {
  return (
    <Link href={`/dashboard/library/${book.id}`} className="flex h-full group">
      <Card 
        className="overflow-hidden h-full flex flex-col w-full border-border group-hover:border-primary group-hover:shadow-lg transition-all"
      >
        <div className="relative aspect-[2/3] w-full">
          <Image
            src={book.imageUrl}
            alt={book.title}
            data-ai-hint={book.imageHint}
            fill
            className="object-cover"
          />
        </div>
        <CardContent className="p-4 flex-1 flex flex-col">
          <div>
            <h3 className="font-headline font-semibold tracking-tight line-clamp-2 group-hover:text-primary transition-colors">{book.title}</h3>
            <p className="text-sm text-muted-foreground">{book.author}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
