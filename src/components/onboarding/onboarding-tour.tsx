'use client';

import { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { Home, BookText, Wind, ListChecks, TrendingUp, Sparkles } from 'lucide-react';

const tourSteps = [
  {
    icon: Sparkles,
    title: '¡Hola de nuevo, {userName}!',
    description: 'Soy Cero, tu compañero de IA. ¿Te parece si te doy un tour rápido para que veas todo lo que puedes hacer aquí?',
    nextButtonText: '¡Claro, muéstrame!'
  },
  {
    icon: Home,
    title: '1. El Inicio, tu centro de mando',
    description: 'Aquí puedes registrar cómo te sientes cada día y recibir un pequeño mensaje de mi parte. Es nuestro chequeo diario.',
    nextButtonText: 'Entendido',
    prevButtonText: 'Volver'
  },
  {
    icon: BookText,
    title: '2. El Diario, tu espacio personal',
    description: 'Un lugar privado para tus pensamientos. Escribe libremente y, si quieres, analizaré tus entradas para ayudarte a encontrar claridad.',
    nextButtonText: 'Suena bien',
    prevButtonText: 'Atrás'
  },
  {
    icon: Wind,
    title: '3. Calma, tu refugio',
    description: 'Cuando necesites un respiro, ven aquí. Encontrarás ejercicios y herramientas para liberar el estrés y encontrar tu centro.',
    nextButtonText: 'Perfecto',
    prevButtonText: 'Atrás'
  },
  {
    icon: ListChecks,
    title: '4. Hábitos, tu camino a la constancia',
    description: 'Construye la rutina que deseas. Añade hábitos, sigue tu progreso y crea la constancia que te llevará a tus metas.',
    nextButtonText: '¡Genial!',
    prevButtonText: 'Atrás'
  },
  {
    icon: TrendingUp,
    title: '5. Progreso, tu mapa de viaje',
    description: 'Visualiza tu evolución. Gráficos de tu estado de ánimo y consistencia de hábitos para que veas todo lo que has avanzado.',
    nextButtonText: 'Casi terminamos',
    prevButtonText: 'Atrás'
  },
  {
    icon: Sparkles,
    title: '¡Estás listo para empezar!',
    description: 'Explora, experimenta y recuerda que cada pequeño paso es un gran avance. Estoy aquí para acompañarte.',
    nextButtonText: 'Comenzar mi viaje',
    prevButtonText: 'Volver a ver'
  }
];

const TOUR_STORAGE_KEY = 'umbral_tour_completed';

export function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const hasSeenTour = localStorage.getItem(TOUR_STORAGE_KEY);
    const name = localStorage.getItem('userName');
    if (name) setUserName(name);

    // To prevent hydration errors, we ensure this only runs on the client
    // after the initial render has completed.
    if (typeof window !== "undefined" && !hasSeenTour) {
      setIsOpen(true);
    }
  }, []);

  const handleNext = () => {
    if (step < tourSteps.length - 1) {
      setStep(prev => prev + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(prev => prev - 1);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem(TOUR_STORAGE_KEY, 'true');
  };

  if(!isOpen) return null;

  const currentStep = tourSteps[step];
  const Icon = currentStep.icon;

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader className="text-center items-center">
          <div className="mb-4 bg-primary/10 p-3 rounded-full w-fit">
            <Icon className="h-8 w-8 text-primary" />
          </div>
          <AlertDialogTitle className="font-headline text-xl">
            {currentStep.title.replace('{userName}', userName)}
          </AlertDialogTitle>
          <AlertDialogDescription className="min-h-[60px]">
            {currentStep.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row justify-between w-full pt-4">
          {step > 0 ? (
            <Button variant="ghost" onClick={handlePrev}>
                {currentStep.prevButtonText || 'Anterior'}
            </Button>
          ) : <div />}
          <Button onClick={handleNext}>
            {currentStep.nextButtonText || 'Siguiente'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
