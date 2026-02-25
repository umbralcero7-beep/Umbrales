import type { AnalyzeJournalEntryOutput } from "@/ai/flows/analyze-journal-entry";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Lightbulb, ListTree, Smile, Sparkles, Star } from "lucide-react";

type JournalAnalysisProps = {
  analysis: AnalyzeJournalEntryOutput;
};

export function JournalAnalysis({ analysis }: JournalAnalysisProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="flex items-center text-lg font-semibold mb-2"><Smile className="mr-2 h-5 w-5 text-primary" /> Sentimiento General</h3>
        <Badge variant={analysis.sentiment === 'positive' ? 'default' : analysis.sentiment === 'negative' ? 'destructive' : 'secondary'} className={analysis.sentiment === 'positive' ? 'bg-green-600/20 text-green-700 border-green-600/20' : ''}>
            {analysis.sentiment}
        </Badge>
      </div>
      <Separator />
      <div>
        <h3 className="flex items-center text-lg font-semibold mb-2"><Lightbulb className="mr-2 h-5 w-5 text-primary" /> Temas Clave</h3>
        <div className="flex flex-wrap gap-2">
          {analysis.topics.map((topic) => (
            <Badge key={topic} variant="secondary">{topic}</Badge>
          ))}
        </div>
      </div>
      <Separator />
      <div>
        <h3 className="flex items-center text-lg font-semibold mb-2"><ListTree className="mr-2 h-5 w-5 text-primary" /> Patrones Potenciales</h3>
        <ul className="list-disc list-inside text-muted-foreground space-y-1">
          {analysis.patterns.map((pattern, index) => (
            <li key={index}>{pattern}</li>
          ))}
        </ul>
      </div>
      <Separator />
      <div>
        <h3 className="flex items-center text-lg font-semibold mb-2"><Star className="mr-2 h-5 w-5 text-primary" /> Resumen</h3>
        <p className="text-muted-foreground">{analysis.summary}</p>
      </div>
      <Separator />
      <div>
        <h3 className="flex items-center text-lg font-semibold mb-2"><Sparkles className="mr-2 h-5 w-5 text-primary" /> Sugerencia de Cero</h3>
        <p className="text-muted-foreground">{analysis.suggestedAction}</p>
      </div>
    </div>
  );
}
