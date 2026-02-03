'use server';

/**
 * @fileOverview Analyzes mood patterns to provide insights and suggestions.
 *
 * - analyzeMoodPatterns - A function that returns an analysis of mood data.
 * - AnalyzeMoodPatternsInput - The input type for the function.
 * - AnalyzeMoodPatternsOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const MoodEntrySchema = z.object({
  date: z.string(),
  mood: z.string(),
});

const AnalyzeMoodPatternsInputSchema = z.object({
  moodHistory: z.array(MoodEntrySchema).describe("The user's mood history for the last week."),
});
export type AnalyzeMoodPatternsInput = z.infer<typeof AnalyzeMoodPatternsInputSchema>;

const AnalyzeMoodPatternsOutputSchema = z.object({
  analysis: z.string().describe('A concise, empathetic analysis identifying days with low moods (like Triste, Ansioso, Estresado) and one or two actionable suggestions for improvement.'),
});
export type AnalyzeMoodPatternsOutput = z.infer<typeof AnalyzeMoodPatternsOutputSchema>;

export async function analyzeMoodPatterns(
  input: AnalyzeMoodPatternsInput
): Promise<AnalyzeMoodPatternsOutput> {
  return analyzeMoodPatternsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeMoodPatternsPrompt',
  input: { schema: AnalyzeMoodPatternsInputSchema },
  output: { schema: AnalyzeMoodPatternsOutputSchema },
  prompt: `Eres Cero, un coach de bienestar. Analiza el siguiente historial de estados de ánimo del usuario de la última semana.

Identifica los días en que el usuario tuvo "bajones" (estados de ánimo negativos como Triste, Ansioso, Estresado, Cansado).

Basado en esto, proporciona un breve análisis empático y una o dos sugerencias prácticas para mejorar su bienestar. Puedes recomendar funciones de la app Umbral, como usar la sección 'Calma' para la ansiedad, escribir en el 'Diario' para la tristeza, o explorar un libro en la 'Librería'.

Sé conciso, alentador y responde directamente en el campo 'analysis'.

Historial de ánimo:
{{#each moodHistory}}
- {{date}}: {{mood}}
{{/each}}

Responde en español.`,
});

const analyzeMoodPatternsFlow = ai.defineFlow(
  {
    name: 'analyzeMoodPatternsFlow',
    inputSchema: AnalyzeMoodPatternsInputSchema,
    outputSchema: AnalyzeMoodPatternsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
