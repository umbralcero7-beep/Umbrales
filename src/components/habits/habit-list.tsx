"use client";

import { useState } from 'react';
import { habits as initialHabits, type Habit } from '@/lib/data';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '../ui/button';
import { ListChecks, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function HabitList() {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");
  const { toast } = useToast();

  const toggleHabit = (id: string) => {
    setHabits(
      habits.map((habit) =>
        habit.id === id ? { ...habit, completed: !habit.completed } : habit
      )
    );
    const habit = habits.find(h => h.id === id);
    if (habit && !habit.completed) {
      toast({
        title: "¡Hábito completado!",
        description: `¡Buen trabajo en "${habit.name}"!`,
      });
    }
  };

  const handleSaveHabit = () => {
    if (newHabitName.trim() === "") {
        toast({
            variant: "destructive",
            title: "El nombre no puede estar vacío",
            description: "Por favor, escribe un nombre para tu hábito.",
        });
        return;
    }

    const newHabit: Habit = {
        id: `habit-${Date.now()}`,
        name: newHabitName.trim(),
        completed: false,
    };

    setHabits((prevHabits) => [...prevHabits, newHabit]);
    setNewHabitName("");
    setIsDialogOpen(false);
    toast({
        title: "¡Hábito Añadido!",
        description: `Has añadido "${newHabit.name}" a tu lista.`,
    });
  };
  
  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setNewHabitName("");
    }
  }

  return (
    <div className="space-y-4">
      {habits.length > 0 ? (
        habits.map((habit) => (
            <div
            key={habit.id}
            className="flex items-center space-x-3 rounded-lg border p-4 transition-colors data-[completed=true]:bg-muted/50"
            data-completed={habit.completed}
            >
            <Checkbox
                id={habit.id}
                checked={habit.completed}
                onCheckedChange={() => toggleHabit(habit.id)}
            />
            <Label
                htmlFor={habit.id}
                className={cn("flex-1 text-sm font-medium cursor-pointer", habit.completed && "line-through text-muted-foreground")}
            >
                {habit.name}
            </Label>
            </div>
        ))
      ) : (
        <div className="text-center py-10 border-2 border-dashed rounded-lg">
            <ListChecks className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-4 text-sm text-muted-foreground">Aún no tienes hábitos. ¡Añade uno para empezar!</p>
        </div>
      )}
       <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
        <DialogTrigger asChild>
            <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Añadir nuevo hábito
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Añadir Nuevo Hábito</DialogTitle>
                <DialogDescription>
                    ¿Qué buen hábito quieres construir? Sé específico.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="habit-name" className="text-right">
                        Nombre
                    </Label>
                    <Input
                        id="habit-name"
                        value={newHabitName}
                        onChange={(e) => setNewHabitName(e.target.value)}
                        className="col-span-3"
                        placeholder="Ej: Leer 10 páginas"
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveHabit()}
                    />
                </div>
            </div>
            <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                </Button>
                <Button type="button" onClick={handleSaveHabit}>
                    Guardar Hábito
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
