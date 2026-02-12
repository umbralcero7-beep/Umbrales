import { PlaceHolderImages } from "./placeholder-images";
import type { AnalyzeJournalEntryOutput } from '@/ai/flows/analyze-journal-entry';


export type Mood = {
  name: string;
  emoji: string;
};

export const moods: Mood[] = [
    { name: 'Feliz', emoji: '😊' },
    { name: 'Calmado', emoji: '😌' },
    { name: 'Pensativo', emoji: '🤔' },
    { name: 'Cansado', emoji: '😫' },
    { name: 'Ansioso', emoji: '😖' },
    { name: 'Triste', emoji: '😢' },
];

// This is now handled in use-habits.tsx to populate Firestore for new users.
export const initialHabitsData: {name: string}[] = [
    { name: 'Caminata diaria de 15 minutos' },
    { name: '5 minutos de respiración consciente' },
    { name: 'Escribir un pensamiento en el diario' },
    { name: 'Leer 10 páginas de un libro' },
];

export type Book = {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
  imageHint: string;
  category: 'Energía' | 'Reflexión' | 'Calma' | 'Crecimiento';
};

const getImage = (id: string) => PlaceHolderImages.find(p => p.id === id) || PlaceHolderImages[0];

export const books: Book[] = [
    {
      id: 'subtle-art',
      title: 'El sutil arte de que (no) te importe nada',
      author: 'Mark Manson',
      imageUrl: getImage('subtle-art').imageUrl,
      imageHint: getImage('subtle-art').imageHint,
      category: 'Crecimiento',
    },
    {
      id: 'power-of-now',
      title: 'El Poder del Ahora',
      author: 'Eckhart Tolle',
      imageUrl: getImage('power-of-now').imageUrl,
      imageHint: getImage('power-of-now').imageHint,
      category: 'Calma',
    },
    {
      id: 'deja-de-ser-tu',
      title: 'Deja de ser tú',
      author: 'Joe Dispenza',
      imageUrl: getImage('deja-de-ser-tu').imageUrl,
      imageHint: getImage('deja-de-ser-tu').imageHint,
      category: 'Crecimiento',
    },
    {
      id: 'cosas-buenas',
      title: 'Cómo hacer que te pasen cosas buenas',
      author: 'Marian Rojas Estapé',
      imageUrl: getImage('cosas-buenas').imageUrl,
      imageHint: getImage('cosas-buenas').imageHint,
      category: 'Reflexión',
    },
    {
      id: 'inteligencia-emocional',
      title: 'Inteligencia Emocional',
      author: 'Daniel Goleman',
      imageUrl: getImage('inteligencia-emocional').imageUrl,
      imageHint: getImage('inteligencia-emocional').imageHint,
      category: 'Reflexión',
    },
    {
      id: '48-leyes-poder',
      title: 'Las 48 leyes del poder',
      author: 'Robert Greene',
      imageUrl: getImage('48-leyes-poder').imageUrl,
      imageHint: getImage('48-leyes-poder').imageHint,
      category: 'Crecimiento',
    },
    {
      id: 'mente-millonaria',
      title: 'Los secretos de la mente millonaria',
      author: 'T. Harv Eker',
      imageUrl: getImage('mente-millonaria').imageUrl,
      imageHint: getImage('mente-millonaria').imageHint,
      category: 'Crecimiento',
    },
    {
      id: 'padre-rico',
      title: 'Padre rico, padre pobre',
      author: 'Robert T. Kiyosaki',
      imageUrl: getImage('padre-rico').imageUrl,
      imageHint: getImage('padre-rico').imageHint,
      category: 'Crecimiento',
    },
      {
      id: 'psicologia-oscura',
      title: 'Psicología oscura',
      author: 'Steven Turner',
      imageUrl: getImage('psicologia-oscura').imageUrl,
      imageHint: getImage('psicologia-oscura').imageHint,
      category: 'Reflexión',
    },
    {
      id: 'mananas-milagrosas',
      title: 'Mañanas milagrosas',
      author: 'Hal Elrod',
      imageUrl: getImage('mananas-milagrosas').imageUrl,
      imageHint: getImage('mananas-milagrosas').imageHint,
      category: 'Energía',
    },
    {
      id: 'zonas-erroneas',
      title: 'Tus zonas erróneas',
      author: 'Wayne Dyer',
      imageUrl: getImage('zonas-erroneas').imageUrl,
      imageHint: getImage('zonas-erroneas').imageHint,
      category: 'Reflexión',
    },
    {
      id: 'meditaciones',
      title: 'Meditaciones',
      author: 'Marco Aurelio',
      imageUrl: getImage('meditaciones').imageUrl,
      imageHint: getImage('meditaciones').imageHint,
      category: 'Reflexión',
    },
    {
      id: 'poder-sin-limites',
      title: 'Poder sin límites',
      author: 'Tony Robbins',
      imageUrl: getImage('poder-sin-limites').imageUrl,
      imageHint: getImage('poder-sin-limites').imageHint,
      category: 'Crecimiento',
    },
    {
      id: 'atomic-habits',
      title: 'Hábitos Atómicos',
      author: 'James Clear',
      imageUrl: getImage('atomic-habits').imageUrl,
      imageHint: getImage('atomic-habits').imageHint,
      category: 'Crecimiento',
    },
];

export const bookRecommendations: Book[] = books.slice(0, 5);
export const inProgressBooks: Book[] = [];

export type JournalEntry = {
    id: string;
    date: string;
    content: string;
    analysis: AnalyzeJournalEntryOutput;
};

export const moodData: { date: string; mood: string }[] = [
    { date: 'Hace 6 días', mood: 'Feliz' },
    { date: 'Hace 5 días', mood: 'Calmado' },
    { date: 'Hace 4 días', mood: 'Ansioso' },
    { date: 'Hace 3 días', mood: 'Triste' },
    { date: 'Hace 2 días', mood: 'Cansado' },
    { date: 'Ayer', mood: 'Calmado' },
    { date: 'Hoy', mood: 'Pensativo' },
];

export const achievements = [
    { id: '1', name: 'Primera Entrada de Diario', unlocked: true, icon: 'Feather', description: 'Escribe tu primera reflexión en el diario.' },
    { id: '2', name: 'Racha de 7 Días', unlocked: false, icon: 'Flame', description: 'Completa al menos un hábito durante 7 días seguidos.' },
    { id: '3', name: 'Lector Consciente', unlocked: false, icon: 'BookOpen', description: 'Termina de leer tu primer libro en la librería.' },
    { id: '4', name: 'Maestro del Ánimo', unlocked: false, icon: 'Smile', description: 'Registra tu estado de ánimo durante 15 días.' },
    { id: '5', name: 'Calma Alcanzada', unlocked: true, icon: 'Wind', description: 'Completa 10 ejercicios de respiración en la sección Calma.' },
    { id: '6', name: 'Madrugador', unlocked: false, icon: 'Sunrise', description: 'Completa un hábito antes de las 8 a.m. por 5 días.' },
    { id: '9', name: 'Planificador Maestro', unlocked: false, icon: 'Clock', description: 'Establece tu primer recordatorio para un hábito.'},
    { id: '7', name: 'Logro de 1 Mes', unlocked: false, icon: 'Award', description: 'Mantén una racha de hábitos durante 30 días.' },
    { id: '8', name: 'Héroe de Hábitos', unlocked: false, icon: 'Shield', description: 'Completa más de 50 hábitos en total.' },
];
