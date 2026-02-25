'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { JournalForm } from "@/components/journal/journal-form";
import { JournalEntryDetail } from "@/components/journal/journal-entry-detail";
import { Badge } from "@/components/ui/badge";
import { BookDashed } from "lucide-react";
import { useJournal } from "@/hooks/use-journal";
import type { JournalEntry } from '@/lib/data';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function JournalPage() {
  const { entries } = useJournal();
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-2">
        {selectedEntry ? (
            <JournalEntryDetail entry={selectedEntry} onBack={() => setSelectedEntry(null)} />
        ) : (
            <JournalForm />
        )}
      </div>
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Entradas Anteriores</CardTitle>
            <CardDescription>Revisa tus pensamientos y reflexiones.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[70vh]">
                <div className="space-y-4 pr-4">
                {entries.length > 0 ? (
                entries.map((entry) => (
                    <button
                        key={entry.id}
                        className={cn(
                            "w-full text-left p-4 border rounded-lg hover:bg-muted/50 transition-colors",
                            selectedEntry?.id === entry.id && "bg-muted/80 ring-2 ring-primary"
                        )}
                        onClick={() => setSelectedEntry(entry)}
                    >
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-medium">{entry.date}</p>
                        <Badge variant={entry.analysis.sentiment === 'positive' ? 'default' : entry.analysis.sentiment === 'negative' ? 'destructive' : 'secondary'} className={entry.analysis.sentiment === 'positive' ? 'bg-green-600/20 text-green-700 border-green-600/20' : ''}>
                        {entry.analysis.sentiment}
                        </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                        {entry.content}
                    </p>
                    </button>
                ))
                ) : (
                    <div className="text-center py-10 border-2 border-dashed rounded-lg">
                        <BookDashed className="mx-auto h-8 w-8 text-muted-foreground" />
                        <p className="mt-4 text-sm text-muted-foreground">No hay entradas de diario todavía.</p>
                    </div>
                )}
                </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
