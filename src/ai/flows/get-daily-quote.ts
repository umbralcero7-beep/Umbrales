'use server';

/**
 * @fileOverview Provides a daily motivational quote from a book in the library.
 *
 * - getDailyQuote - A function that returns a quote and its source.
 * - GetDailyQuoteOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GetDailyQuoteOutputSchema = z.object({
  quote: z
    .string()
    .describe(
      'A short, inspiring, and motivational quote from a well-known book.'
    ),
  bookTitle: z.string().describe('The title of the book the quote is from.'),
});
export type GetDailyQuoteOutput = z.infer<typeof GetDailyQuoteOutputSchema>;

export async function getDailyQuote(): Promise<GetDailyQuoteOutput> {
  return getDailyQuoteFlow();
}

const prompt = ai.definePrompt({
  name: 'getDailyQuotePrompt',
  output: { schema: GetDailyQuoteOutputSchema },
  prompt: `Eres "Cero", un coach de bienestar digital de apoyo. Tu tarea es proporcionar una única frase o cita motivacional e inspiradora para empezar el día.

La cita debe ser de uno de los siguientes libros de la biblioteca de la app. DEBES seleccionar un libro de esta lista.
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

Elige una cita que sea universalmente alentadora. La cita debe ser real del libro. Responde en español.`,
});

const getDailyQuoteFlow = ai.defineFlow(
  {
    name: 'getDailyQuoteFlow',
    outputSchema: GetDailyQuoteOutputSchema,
  },
  async () => {
    const { output } = await prompt();
    return output!;
  }
);
