import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { JournalForm } from "@/components/journal/journal-form";
import { journalEntries } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { BookDashed } from "lucide-react";

export default function JournalPage() {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-2">
        <JournalForm />
      </div>
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Entradas Anteriores</CardTitle>
            <CardDescription>Revisa tus pensamientos y reflexiones anteriores.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {journalEntries.length > 0 ? (
              journalEntries.map((entry) => (
                <div key={entry.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium">{entry.date}</p>
                    <Badge variant={entry.sentiment === 'positive' ? 'default' : entry.sentiment === 'negative' ? 'destructive' : 'secondary'} className={entry.sentiment === 'positive' ? 'bg-green-600/20 text-green-700 border-green-600/20' : ''}>
                      {entry.sentiment}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {entry.content}
                  </p>
                </div>
              ))
            ) : (
                <div className="text-center py-10 border-2 border-dashed rounded-lg">
                    <BookDashed className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-4 text-sm text-muted-foreground">No hay entradas de diario todavía.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
