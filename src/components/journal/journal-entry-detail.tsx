import type { JournalEntry } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { JournalAnalysis } from "./journal-analysis";
import { ScrollArea } from "../ui/scroll-area";

type JournalEntryDetailProps = {
  entry: JournalEntry;
  onBack: () => void;
};

export function JournalEntryDetail({ entry, onBack }: JournalEntryDetailProps) {
  return (
    <div className="space-y-8">
        <Button variant="ghost" onClick={onBack} className="pl-0">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Volver a las entradas
        </Button>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Detalle de la Entrada</CardTitle>
                <CardDescription>
                    {entry.date}
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <ScrollArea className="h-[200px] mb-6 p-4 border rounded-lg bg-muted/30">
                    <p className="text-sm text-foreground whitespace-pre-wrap">{entry.content}</p>
                 </ScrollArea>
                 <JournalAnalysis analysis={entry.analysis} />
            </CardContent>
        </Card>
    </div>
  );
}
