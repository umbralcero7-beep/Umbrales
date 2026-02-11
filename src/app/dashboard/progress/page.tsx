import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs";
  import { MoodChart } from "@/components/progress/mood-chart";
  import { HabitChart } from "@/components/progress/habit-chart";
  import { achievements } from "@/lib/data";
  import { Award, BookOpen, Feather, Flame, Shield, Smile, Sunrise, Wind, Clock } from "lucide-react";
  import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
  import { HabitConsistencyChart } from "@/components/progress/habit-consistency-chart";
  import { MoodAnalysis } from "@/components/progress/mood-analysis";
  
  const iconMap: { [key: string]: React.ElementType } = {
    Feather, Flame, BookOpen, Smile, Wind, Sunrise, Award, Shield, Clock
  };
  
  export default function ProgressPage() {
    return (
      <Tabs defaultValue="achievements">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="mood">Ánimo</TabsTrigger>
          <TabsTrigger value="habits">Hábitos</TabsTrigger>
          <TabsTrigger value="achievements">Logros</TabsTrigger>
        </TabsList>
        <TabsContent value="mood">
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                    <CardTitle className="font-headline">Tendencias de Ánimo</CardTitle>
                    <CardDescription>
                        Visualiza tus patrones de estado de ánimo de la última semana.
                    </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <MoodChart />
                    </CardContent>
                </Card>
                <MoodAnalysis />
            </div>
        </TabsContent>
        <TabsContent value="habits">
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Consistencia Mensual</CardTitle>
                        <CardDescription>
                        Resumen de tus hábitos completados este mes.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <HabitConsistencyChart />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Resumen Semanal</CardTitle>
                        <CardDescription>
                        Hábitos completados por día en la última semana.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <HabitChart />
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
        <TabsContent value="achievements">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Tus Logros</CardTitle>
              <CardDescription>
                Hitos que has desbloqueado en tu viaje. Pasa el cursor sobre un logro para ver cómo desbloquearlo.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {achievements.map((achievement) => {
                const Icon = iconMap[achievement.icon] || Award;
                return (
                  <Tooltip key={achievement.id}>
                    <TooltipTrigger asChild>
                      <div
                        className="flex flex-col items-center justify-center gap-2 p-4 border rounded-lg text-center transition-all h-full data-[unlocked=true]:border-primary/30 data-[unlocked=true]:shadow-lg data-[unlocked=true]:shadow-primary/10 data-[unlocked=false]:opacity-50 data-[unlocked=false]:grayscale"
                        data-unlocked={achievement.unlocked}
                      >
                        <div 
                          className="p-3 rounded-full bg-primary/10 data-[unlocked=true]:bg-primary data-[unlocked=true]:text-primary-foreground transition-colors"
                          data-unlocked={achievement.unlocked}
                        >
                            <Icon 
                              className="w-8 h-8 text-primary data-[unlocked=true]:text-primary-foreground transition-colors"
                              data-unlocked={achievement.unlocked}
                            />
                        </div>
                        <p className="font-semibold text-sm">{achievement.name}</p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{achievement.description}</p>
                      {achievement.unlocked && <p className="font-bold mt-1 text-primary">¡Desbloqueado!</p>}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    );
  }
