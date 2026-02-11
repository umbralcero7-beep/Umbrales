import { MoodSelector } from "@/components/dashboard/mood-selector";
import { DailyMessage } from "@/components/dashboard/daily-message";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Library, Wind } from "lucide-react";
import { OnboardingTour } from "@/components/onboarding/onboarding-tour";

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-start text-center gap-12 py-8 md:py-12 px-4">
        <OnboardingTour />
        <DailyMessage />
        
        <div className="w-full max-w-md space-y-8">
            <div className="max-w-md mx-auto">
                <h1 className="text-3xl font-bold font-headline">¿Cómo te sientes hoy?</h1>
                <p className="text-muted-foreground mt-2">Tu selección nos ayudará a darte un mejor acompañamiento.</p>
            </div>
            <MoodSelector />
        </div>

        <div className="w-full max-w-2xl space-y-6">
          <h2 className="text-2xl font-bold font-headline">Explorar</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/dashboard/library" className="block">
              <Card className="h-full hover:border-primary transition-colors text-left">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Library className="h-6 w-6 text-primary"/>
                    </div>
                    <div>
                      <CardTitle className="font-headline">Librería Emocional</CardTitle>
                      <CardDescription>Contenido curado para nutrir tu mente.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/dashboard/calm" className="block">
              <Card className="h-full hover:border-primary transition-colors text-left">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Wind className="h-6 w-6 text-primary"/>
                    </div>
                    <div>
                      <CardTitle className="font-headline">Espacio de Calma</CardTitle>
                      <CardDescription>Herramientas para encontrar tu serenidad.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
    </div>
  );
}
