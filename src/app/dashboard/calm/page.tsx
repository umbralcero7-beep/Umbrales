import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BreathingExercise } from "@/components/calm/breathing-exercise";
import { EmotionalRelease } from "@/components/calm/emotional-release";
import { Wind, Feather } from "lucide-react";

export default function CalmPage() {
  return (
    <div className="flex justify-center pt-4 md:pt-8">
      <Tabs defaultValue="breathing" className="w-full max-w-2xl">
        <Card>
            <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-2">
                    <div className="relative h-8 w-8 text-primary">
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
                            <circle cx="50" cy="50" r="30" fill="currentColor" />
                        </svg>
                    </div>
                </div>
                <CardTitle className="font-headline text-2xl">Un Espacio para la Calma</CardTitle>
                <CardDescription>
                    Cruza el umbral. Herramientas para encontrar tu centro y serenidad.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="breathing">
                        <Wind className="mr-2 h-4 w-4" />
                        Respiración
                    </TabsTrigger>
                    <TabsTrigger value="release">
                        <Feather className="mr-2 h-4 w-4" />
                        Liberación
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="breathing" className="pt-6">
                    <BreathingExercise />
                </TabsContent>
                <TabsContent value="release" className="pt-6">
                    <EmotionalRelease />
                </TabsContent>
            </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
