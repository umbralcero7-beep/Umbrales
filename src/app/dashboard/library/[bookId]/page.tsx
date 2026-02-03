import { books } from '@/lib/data';
import { ReadBookClient } from '@/components/library/read-book-client';

export async function generateStaticParams() {
  return books.map((book) => ({
    bookId: book.id,
  }));
}

type ReadBookPageProps = {
  params: {
    bookId: string;
  };
};

export default function ReadBookPage({ params }: ReadBookPageProps) {
  const book = books.find((b) => b.id === params.bookId);

  return <ReadBookClient book={book} />;
}
