'use client';

import { useState, useEffect } from 'react';
import Joyride, { Step, CallBackProps, STATUS } from 'react-joyride';
import { useTheme } from '@/components/theme-provider';

const TOUR_STORAGE_KEY = 'umbral_tour_completed_v3';

export function OnboardingTour() {
  const [runTour, setRunTour] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [userName, setUserName] = useState('');
  const { theme } = useTheme();

  const tourSteps: Step[] = [
    {
      target: 'body',
      content: `¡Bienvenido a Umbral, ${userName}! Soy Cero, tu compañero en este viaje. Permíteme mostrarte cómo funciona cada módulo.`,
      placement: 'center',
    },
    {
      target: '#mood-selector-container',
      content: 'Aquí puedes registrar cómo te sientes cada día. Es el primer paso para entender tus emociones y recibir apoyo personalizado.',
      placement: 'bottom',
    },
    {
      target: '#nav-diario',
      content: 'En tu Diario puedes escribir tus pensamientos. Cero te ayudará a analizarlos para encontrar patrones y claridad.',
      placement: 'right',
    },
    {
      target: '#nav-calma',
      content: 'Este es tu Espacio de Calma. Usa los ejercicios de respiración y liberación para encontrar serenidad cuando lo necesites.',
      placement: 'right',
    },
    {
      target: '#nav-hábitos',
      content: 'Aquí puedes crear y dar seguimiento a los hábitos que te ayudarán a construir una rutina positiva.',
      placement: 'right',
    },
    {
      target: '#nav-progreso',
      content: 'Visualiza tus patrones de ánimo, la consistencia de tus hábitos y los logros que has desbloqueado en tu viaje.',
      placement: 'right',
    },
     {
      target: '#nav-ajustes',
      content: 'Finalmente, aquí puedes personalizar la apariencia de la aplicación y gestionar la configuración de tu cuenta.',
      placement: 'right',
    },
    {
      target: 'body',
      content: '¡Eso es todo por ahora! Explora a tu ritmo. Estoy aquí para ayudarte a construir tu propio camino.',
      placement: 'center',
    },
  ];

  useEffect(() => {
    setIsClient(true);
    const hasSeenTour = localStorage.getItem(TOUR_STORAGE_KEY);
    const name = localStorage.getItem('userName');
    
    if (name) {
      setUserName(name);
    }
    
    // Use a timeout to ensure the DOM is ready, especially for the sidebar nav
    if (typeof window !== 'undefined' && !hasSeenTour) {
      setTimeout(() => {
        setRunTour(true);
      }, 1500); 
    }
  }, []);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      localStorage.setItem(TOUR_STORAGE_KEY, 'true');
      setRunTour(false);
    }
  };
  
  if (!isClient) {
    return null;
  }

  return (
    <Joyride
      run={runTour}
      steps={tourSteps}
      callback={handleJoyrideCallback}
      continuous
      showProgress
      showSkipButton
      locale={{
          back: 'Atrás',
          close: 'Cerrar',
          last: 'Terminar',
          next: 'Siguiente',
          skip: 'Omitir',
      }}
      styles={{
        options: {
          arrowColor: theme === 'cosmos' || theme === 'bosque' || theme === 'atardecer' ? '#2d283d' : '#ffffff',
          backgroundColor: theme === 'cosmos' || theme === 'bosque' || theme === 'atardecer' ? '#2d283d' : '#ffffff',
          primaryColor: 'hsl(var(--primary))',
          textColor: theme === 'cosmos' || theme === 'bosque' || theme === 'atardecer' ? '#f8fafc' : '#020617',
          zIndex: 1000,
        },
        tooltip: {
            borderRadius: 'var(--radius)',
        },
        buttonNext: {
            borderRadius: 'var(--radius)',
            backgroundColor: 'hsl(var(--primary))',
        },
        buttonBack: {
            color: 'hsl(var(--primary))'
        },
        buttonSkip: {
            color: 'hsl(var(--muted-foreground))'
        }
      }}
    />
  );
}
