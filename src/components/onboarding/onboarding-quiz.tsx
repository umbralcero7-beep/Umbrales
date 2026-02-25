'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Brain, Heart, Smile, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHabits } from '@/hooks/use-habits';
import { useRouter } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

type OnboardingQuizProps = {
  userName: string;
};

const purposeOptions = [
    { 
        key: 'Salud', 
        label: 'Salud', 
        icon: Heart, 
        starterPack: [
            { id: 'health-1', name: 'Caminata diaria de 15 minutos' },
            { id: 'health-2', name: 'Beber un vaso de agua al despertar' },
            { id: 'health-3', name: 'Estirarse por 5 minutos por la mañana' },
        ]
    },
    { 
        key: 'Creatividad', 
        label: 'Creatividad', 
        icon: Brain,
        starterPack: [
            { id: 'creative-1', name: 'Escribir una idea nueva al día' },
            { id: 'creative-2', name: 'Leer 10 páginas de un libro' },
            { id: 'creative-3', name: 'Dedicar 15 min a un hobby creativo' },
        ]
    },
    { 
        key: 'Productividad', 
        label: 'Productividad', 
        icon: Zap,
        starterPack: [
            { id: 'prod-1', name: 'Planificar mis 3 tareas del día' },
            { id: 'prod-2', name: 'Organizar mi escritorio por 5 min' },
            { id: 'prod-3', name: 'Revisar mi agenda para mañana' },
        ]
    },
    { 
        key: 'Bienestar emocional', 
        label: 'Bienestar emocional', 
        icon: Smile,
        starterPack: [
            { id: 'emo-1', name: '5 minutos de respiración consciente' },
            { id: 'emo-2', name: 'Escribir un pensamiento en el diario' },
            { id: 'emo-3', name: 'Agradecer por una cosa antes de dormir' },
        ]
    },
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
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
  const { addHabit } = useHabits();
  const router = useRouter();

  const handlePurposeSelect = (purpose: (typeof purposeOptions)[0]) => {
    setSelectedPurpose(purpose);
    setSelectedHabits(purpose.starterPack.map(h => h.id)); // Pre-select all habits
    setStep(2);
  };

  const handleToggleHabit = (habitId: string) => {
    setSelectedHabits(currentSelected => {
        if (currentSelected.includes(habitId)) {
            return currentSelected.filter(id => id !== habitId); // Uncheck
        } else {
            return [...currentSelected, habitId]; // Check
        }
    });
  };

  const handleAcceptHabits = () => {
    if (selectedPurpose && selectedHabits.length > 0) {
      selectedHabits.forEach(habitId => {
        const habit = selectedPurpose.starterPack.find(h => h.id === habitId);
        if (habit) {
          addHabit(habit.name);
        }
      });
    }
    setStep(3);
  };

  const finishOnboarding = () => {
    localStorage.setItem('userName', userName);
    router.push('/dashboard');
  }
  
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
        <Card>
            <CardHeader className="text-center">
                <CardTitle className="font-headline text-2xl">Un pack de inicio para ti</CardTitle>
                <CardDescription>
                    Basado en tu meta de <span className="font-bold text-primary">{selectedPurpose?.label.toLowerCase()}</span>, te sugiero estos 3 hábitos.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-3">
                    {selectedPurpose?.starterPack.map(habit => (
                        <div key={habit.id} className="flex items-center space-x-3 rounded-md border p-4 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
                            <Checkbox 
                                id={habit.id}
                                checked={selectedHabits.includes(habit.id)}
                                onCheckedChange={() => handleToggleHabit(habit.id)}
                            />
                            <Label htmlFor={habit.id} className="flex-1 cursor-pointer">{habit.name}</Label>
                        </div>
                    ))}
                </div>
                <Button onClick={handleAcceptHabits} className="w-full">Añadir hábitos y continuar</Button>
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
                <CardTitle className="font-headline text-2xl">¡Has dado tus primeros pasos!</CardTitle>
                <CardDescription>Cada hábito es un umbral hacia tu mejor versión.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={finishOnboarding}>
                    Ir a mi panel
                </Button>
            </CardContent>
        </Card>
    );
  }

  return null;
}
