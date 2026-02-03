'use server';

/**
 * @fileOverview A flow for analyzing journal entries to identify key topics,
 * prevalent sentiments, and potential patterns in thoughts and emotions.
 *
 * - analyzeJournalEntry - Analyzes a user's journal entry and provides insights.
 * - AnalyzeJournalEntryInput - The input type for the analyzeJournalEntry function.
 * - AnalyzeJournalEntryOutput - The return type for the analyzeJournalEntry function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeJournalEntryInputSchema = z.object({
  entryText: z
    .string()
    .describe('The text content of the journal entry to be analyzed.'),
  userName: z.string().describe("The user's name to personalize the response."),
});
export type AnalyzeJournalEntryInput = z.infer<typeof AnalyzeJournalEntryInputSchema>;

const AnalyzeJournalEntryOutputSchema = z.object({
  topics: z
    .array(z.string())
    .describe('Key topics identified in the journal entry.'),
  sentiment: z
    .string()
    .describe('Overall sentiment expressed in the journal entry (e.g., positive, negative, neutral).'),
  patterns: z
    .array(z.string())
    .describe('Potential patterns or recurring themes in the user thoughts and emotions.'),
  summary: z.string().describe("A brief summary of the journal entry, personalized with the user's name."),
  suggestedAction: z.string().describe('Una acción o sugerencia concreta y útil para el usuario, basada en el contenido de su entrada. Por ejemplo, sugerir una función de la app como "Prueba un ejercicio de respiración en la sección Calma" si el usuario expresa estrés, o leer un libro relevante de la librería.')
});
export type AnalyzeJournalEntryOutput = z.infer<typeof AnalyzeJournalEntryOutputSchema>;

export async function analyzeJournalEntry(
  input: AnalyzeJournalEntryInput
): Promise<AnalyzeJournalEntryOutput> {
  return analyzeJournalEntryFlow(input);
}

const analyzeJournalEntryPrompt = ai.definePrompt({
  name: 'analyzeJournalEntryPrompt',
  input: {schema: AnalyzeJournalEntryInputSchema},
  output: {schema: AnalyzeJournalEntryOutputSchema},
  prompt: `Eres Cero, un coach de bienestar empático. Analiza la siguiente entrada de diario e identifica temas clave, sentimiento general y cualquier patrón recurrente en los pensamientos y emociones.

En el campo 'summary', proporciona un breve resumen de la entrada del diario, dirigiéndote al usuario directamente por su nombre: {{userName}}. Por ejemplo: "Veo que hoy reflexionas sobre X, {{userName}}". No empieces el resumen con "El usuario...".

Finalmente, y lo más importante, proporciona una **sugerencia accionable** basada en el análisis. Esta sugerencia debe ser empática y directamente relacionada con el contenido de la entrada. Si es apropiado, sugiere una función específica dentro de la app Umbral.

Funciones de la app que puedes sugerir:
- **Diario:** Animar a seguir escribiendo.
- **Calma:** Si detectas estrés o ansiedad, sugiere un ejercicio de respiración.
- **Librería:** Si un tema se relaciona con un libro disponible, sugiérelo. Libros disponibles: "Hábitos Atómicos", "El Poder del Ahora", "El Hombre en Busca de Sentido", "El Poder de Ser Vulnerable", "Mindfulness para Principiantes".
- **Hábitos:** Si el usuario habla de metas o rutinas, sugiere crear o revisar un hábito.

Nombre del usuario: {{userName}}
Entrada de Diario:
{{entryText}}

Emite los temas, el sentimiento, los patrones, el resumen y la sugerencia accionable en el formato JSON especificado. El sentimiento DEBE ser uno de "positive", "negative", o "neutral".
Responde en español.`,
});

const analyzeJournalEntryFlow = ai.defineFlow(
  {
    name: 'analyzeJournalEntryFlow',
    inputSchema: AnalyzeJournalEntryInputSchema,
    outputSchema: AnalyzeJournalEntryOutputSchema,
  },
  async input => {
    const {output} = await analyzeJournalEntryPrompt(input);
    return output!;
  }
);
