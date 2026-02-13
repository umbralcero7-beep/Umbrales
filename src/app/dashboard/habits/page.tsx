import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { HabitList } from "@/components/habits/habit-list";
  import { HabitSuggestions } from "@/components/habits/habit-suggestions";
  
  export default function HabitsPage() {
    return (
      <div>
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                    <CardTitle className="font-headline text-2xl">Mis Hábitos</CardTitle>
                    <CardDescription>
                        Sigue tus hábitos diarios para construir una mejor rutina.
                    </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <HabitSuggestions />
                </div>
            </div>
          </CardHeader>
          <CardContent>
            <HabitList />
          </CardContent>
        </Card>
      </div>
    );
  }
  