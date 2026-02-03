"use client";

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '../ui/button';
import { ListChecks, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
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
import { useHabits } from '@/hooks/use-habits';

export function HabitList() {
  const { habits, toggleHabit, addHabit } = useHabits();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");

  const handleSaveHabit = () => {
    addHabit(newHabitName);
    // The context handles logic, but we can close the dialog if successful
    if (newHabitName.trim() !== "") {
        setNewHabitName("");
        setIsDialogOpen(false);
    }
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
