'use server';

/**
 * @fileOverview An AI agent that suggests new habits based on user goals, mood, and journal entries.
 *
 * - suggestHabits - A function that suggests new habits.
 * - SuggestHabitsInput - The input type for the suggestHabits function.
 * - SuggestHabitsOutput - The return type for the suggestHabits function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestHabitsInputSchema = z.object({
  goals: z.string().describe('The user\u0027s personal growth goals.'),
  mood: z.string().describe('The user\u0027s current mood.'),
  journalEntries: z.string().describe('The user\u0027s recent journal entries.'),
});
export type SuggestHabitsInput = z.infer<typeof SuggestHabitsInputSchema>;

const SuggestHabitsOutputSchema = z.object({
  suggestedHabits: z.array(
    z.string().describe('A list of habits suggested for the user.')
  ).describe('The habits suggested for the user based on their goals, mood, and journal entries.'),
});
export type SuggestHabitsOutput = z.infer<typeof SuggestHabitsOutputSchema>;

export async function suggestHabits(input: SuggestHabitsInput): Promise<SuggestHabitsOutput> {
  return suggestHabitsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestHabitsPrompt',
  input: {schema: SuggestHabitsInputSchema},
  output: {schema: SuggestHabitsOutputSchema},
  prompt: `Eres un asistente de crecimiento personal. Basado en las metas del usuario, su estado de ánimo y sus entradas de diario recientes, sugiere hábitos que puedan ayudar al usuario. Responde en español.

Metas: {{{goals}}}
Estado de ánimo: {{{mood}}}
Entradas de diario: {{{journalEntries}}}

Sugerir hábitos:`,
});

const suggestHabitsFlow = ai.defineFlow(
  {
    name: 'suggestHabitsFlow',
    inputSchema: SuggestHabitsInputSchema,
    outputSchema: SuggestHabitsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
