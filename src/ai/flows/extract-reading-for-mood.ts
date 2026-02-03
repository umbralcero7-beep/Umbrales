'use server';

/**
 * @fileOverview Extracts a 5-minute reading passage from a book, tailored to the user's mood.
 *
 * - extractReadingForMood - A function that returns a key passage from a book based on mood.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractReadingForMoodInputSchema = z.object({
  bookTitle: z.string().describe('The title of the book to extract a reading from.'),
  mood: z.string().describe('The user\'s current mood, to tailor the passage selection.'),
});

const ExtractReadingForMoodOutputSchema = z.object({
  passage: z
    .string()
    .describe(
      "A 5-minute reading passage from the book, relevant to the user's mood. Around 500-700 words."
    ),
});

export async function extractReadingForMood(
  input: z.infer<typeof ExtractReadingForMoodInputSchema>
): Promise<z.infer<typeof ExtractReadingForMoodOutputSchema>> {
  return extractReadingForMoodFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractReadingForMoodPrompt',
  input: {schema: ExtractReadingForMoodInputSchema},
  output: {schema: ExtractReadingForMoodOutputSchema},
  prompt: `Eres "Cero", un curador de contenido empático. Un usuario se siente "{{mood}}" y quiere leer un pasaje de 5 minutos del libro "{{bookTitle}}" que resuene con su estado de ánimo.

Tu tarea es extraer o generar un pasaje conciso y significativo de aproximadamente 500-700 palabras del libro que sea particularmente relevante para alguien que se siente {{mood}}.

El pasaje debe:
- Ser directamente del libro o estar fuertemente inspirado en enseñanzas clave que puedan ayudar o resonar con el estado de ánimo del usuario.
- Ser lo suficientemente largo para una lectura de 5 minutos (500-700 palabras).
- Estar formateado para facilitar la lectura, con saltos de párrafo.
- Si el estado de ánimo es positivo (ej. 'Feliz', 'Calmado'), elige un pasaje que refuerce ese sentimiento.
- Si el estado de ánimo es negativo (ej. 'Triste', 'Ansioso'), elige un pasaje que ofrezca consuelo, perspectiva o esperanza.

Extrae el pasaje ahora. Responde en español.`,
});

const extractReadingForMoodFlow = ai.defineFlow(
  {
    name: 'extractReadingForMoodFlow',
    inputSchema: ExtractReadingForMoodInputSchema,
    outputSchema: ExtractReadingForMoodOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
