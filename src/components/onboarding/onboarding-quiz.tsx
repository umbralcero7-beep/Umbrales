'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Brain, Heart, Smile, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

type OnboardingQuizProps = {
  userName: string;
};

const purposeOptions = [
    { key: 'Salud', label: 'Salud', icon: Heart, suggestion: 'Una caminata de 15 minutos al día puede cambiar tu energía. ¿Qué tal si empezamos con eso?' },
    { key: 'Creatividad', label: 'Creatividad', icon: Brain, suggestion: '¿Qué tal dedicar 10 minutos a escribir o dibujar libremente? Un pequeño espacio para tus ideas.' },
    { key: 'Productividad', label: 'Productividad', icon: Zap, suggestion: 'Planificar tus 3 tareas más importantes del día puede darte claridad. ¿Lo intentamos?' },
    { key: 'Bienestar emocional', label: 'Bienestar emocional', icon: Smile, suggestion: 'Un hábito pequeño puede abrir grandes puertas. ¿Qué tal empezar con 5 minutos de respiración consciente?' },
];

const CeroIcon = ({ className }: { className?: string }) => (
    <div className={cn("relative text-primary", className)}>
        <svg
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute h-full w-full animate-spin-slow"
        >
            <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray="230"
                strokeDashoffset="75"
            />
        </svg>
        <svg
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full"
        >
            <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                opacity="0.2"
            />
            <circle
                cx="50"
                cy="50"
                r="30"
                fill="currentColor"
            />
        </svg>
    </div>
);


export function OnboardingQuiz({ userName }: OnboardingQuizProps) {
  const [step, setStep] = useState(0);
  const [selectedPurpose, setSelectedPurpose] = useState<(typeof purposeOptions)[0] | null>(null);

  const handlePurposeSelect = (purpose: (typeof purposeOptions)[0]) => {
    setSelectedPurpose(purpose);
    setStep(2);
  };
  
  if (step === 0) {
    return (
        <Card className="text-center">
            <CardHeader>
                <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
                    <CeroIcon className="h-8 w-8" />
                </div>
                <CardTitle className="font-headline text-2xl">Bienvenido a Umbral, {userName}</CardTitle>
                <CardDescription>Aquí no solo registras hábitos, sino que construyes tu propio camino.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={() => setStep(1)}>Comenzar</Button>
            </CardContent>
        </Card>
    );
  }

  if (step === 1) {
    return (
        <Card>
            <CardHeader className="text-center">
                <CardTitle className="font-headline text-2xl">¿Qué quieres cultivar hoy?</CardTitle>
                <CardDescription>Elige un área para empezar a enfocarte.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                {purposeOptions.map((option) => (
                    <Button key={option.key} variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => handlePurposeSelect(option)}>
                        <option.icon className="h-6 w-6 text-primary" />
                        <span>{option.label}</span>
                    </Button>
                ))}
            </CardContent>
        </Card>
    );
  }

  if (step === 2) {
    return (
        <Card className="text-center">
             <CardHeader>
                <CardTitle className="font-headline text-2xl">Primer hábito sugerido</CardTitle>
                <CardDescription>
                    {selectedPurpose?.suggestion}
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <Button onClick={() => setStep(3)}>Aceptar Hábito</Button>
            </CardContent>
        </Card>
    );
  }

  if (step === 3) {
    return (
        <Card className="text-center">
            <CardHeader>
                <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
                    <Award className="h-8 w-8 text-primary"/>
                </div>
                <CardTitle className="font-headline text-2xl">¡Has dado tu primer paso!</CardTitle>
                <CardDescription>Cada hábito es un umbral hacia tu mejor versión.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild>
                    <Link href="/dashboard">Ir a mi panel</Link>
                </Button>
            </CardContent>
        </Card>
    );
  }

  return null;
}
