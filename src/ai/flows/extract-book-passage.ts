'use server';

/**
 * @fileOverview Extracts a 5-minute reading passage from a book.
 *
 * - extractBookPassage - A function that returns a key passage from a book.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractBookPassageInputSchema = z.object({
  bookTitle: z.string().describe('The title of the book to extract a reading from.'),
});

const ExtractBookPassageOutputSchema = z.object({
  passage: z
    .string()
    .describe(
      "A 5-minute reading passage from the book. Around 500-700 words."
    ),
});

export async function extractBookPassage(
  input: z.infer<typeof ExtractBookPassageInputSchema>
): Promise<z.infer<typeof ExtractBookPassageOutputSchema>> {
  return extractBookPassageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractBookPassagePrompt',
  input: {schema: ExtractBookPassageInputSchema},
  output: {schema: ExtractBookPassageOutputSchema},
  prompt: `Eres "Cero", un curador de contenido experto. Un usuario quiere leer un pasaje de 5 minutos del libro "{{bookTitle}}".

Tu tarea es extraer o generar un pasaje conciso y significativo de aproximadamente 500-700 palabras del libro, que sea representativo de sus ideas principales.

El pasaje debe:
- Ser directamente del libro o estar fuertemente inspirado en sus enseñanzas clave.
- Ser lo suficientemente largo para una lectura de 5 minutos (500-700 palabras).
- Estar formateado para facilitar la lectura, con saltos de párrafo.
- Ser diferente cada vez que se solicita para el mismo libro, si es posible, para ofrecer variedad.

Extrae el pasaje ahora. Responde en español.`,
});

const extractBookPassageFlow = ai.defineFlow(
  {
    name: 'extractBookPassageFlow',
    inputSchema: ExtractBookPassageInputSchema,
    outputSchema: ExtractBookPassageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
