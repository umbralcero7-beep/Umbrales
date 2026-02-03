'use server';

/**
 * @fileOverview Provides advice and a book quote based on the user's mood.
 *
 * - getAdviceForMood - A function that returns advice and a quote.
 * - GetAdviceForMoodInput - The input type for the function.
 * - GetAdviceForMoodOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GetAdviceForMoodInputSchema = z.object({
  mood: z.string().describe('The mood selected by the user.'),
});
export type GetAdviceForMoodInput = z.infer<typeof GetAdviceForMoodInputSchema>;

const GetAdviceForMoodOutputSchema = z.object({
  advice: z
    .string()
    .describe(
      'A short, supportive piece of advice for the user based on their mood.'
    ),
  quote: z
    .string()
    .describe(
      'A relevant and inspiring quote from a well-known book.'
    ),
  bookTitle: z.string().describe('The title of the book the quote is from.'),
});
export type GetAdviceForMoodOutput = z.infer<
  typeof GetAdviceForMoodOutputSchema
>;

export async function getAdviceForMood(
  input: GetAdviceForMoodInput
): Promise<GetAdviceForMoodOutput> {
  return getAdviceForMoodFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getAdviceForMoodPrompt',
  input: { schema: GetAdviceForMoodInputSchema },
  output: { schema: GetAdviceForMoodOutputSchema },
  prompt: `Eres "Cero", un coach de bienestar digital de apoyo. Un usuario acaba de registrar su estado de ánimo como: "{{mood}}".

Tu tarea es responder con tres cosas:
1.  Un consejo breve, empático y práctico que pueda ayudar al usuario en este momento.
2.  Una cita inspiradora de uno de los libros de la biblioteca de la app que resuene con su estado de ánimo. La cita debe ser real del libro.
3.  El título del libro del que proviene la cita.

Aquí tienes la lista COMPLETA de libros disponibles en la biblioteca de la app. DEBES seleccionar un libro de esta lista.
- Hábitos Atómicos de James Clear
- El Poder del Ahora de Eckhart Tolle
- El Hombre en Busca de Sentido de Viktor E. Frankl
- El Poder de Ser Vulnerable de Brené Brown
- Mindfulness para Principiantes de Jon Kabat-Zinn
- El Diario de Gratitud de Simple Planners
- El sutil arte de que (no) te importe nada de Mark Manson
- Deja de ser tú de Joe Dispenza
- Cómo hacer que te pasen cosas buenas de Marian Rojas Estapé
- Inteligencia Emocional de Daniel Goleman
- Las 48 leyes del poder de Robert Greene
- Los secretos de la mente millonaria de T. Harv Eker
- Padre rico, padre pobre de Robert T. Kiyosaki
- Psicología oscura de Steven Turner
- Mañanas milagrosas de Hal Elrod
- Tus zonas erróneas de Wayne Dyer
- Meditaciones de Marco Aurelio
- Poder sin límites de Tony Robbins

El tono debe ser alentador y comprensivo. La respuesta debe ser concisa y directa. Responde en español.`,
});

const getAdviceForMoodFlow = ai.defineFlow(
  {
    name: 'getAdviceForMoodFlow',
    inputSchema: GetAdviceForMoodInputSchema,
    outputSchema: GetAdviceForMoodOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
