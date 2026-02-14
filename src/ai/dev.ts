'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-journal-entry.ts';
import '@/ai/flows/suggest-habits.ts';
import '@/ai/flows/get-advice-for-mood.ts';
import '@/ai/flows/get-daily-quote.ts';
import '@/ai/flows/analyze-mood-patterns.ts';
import '@/ai/flows/extract-reading-for-mood.ts';
