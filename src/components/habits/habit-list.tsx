"use client";

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '../ui/button';
import { ListChecks, Plus, Clock, BellOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
  } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useHabits } from '@/hooks/use-habits';
import type { DisplayHabit } from '@/hooks/use-habits';

function ReminderDialog({ habit }: { habit: DisplayHabit }) {
    const { setHabitReminder } = useHabits();
    const [time, setTime] = useState(habit.reminderTime || "09:00");

    const handleSave = () => {
        setHabitReminder(habit.id, time);
    };

    const handleRemove = () => {
        setHabitReminder(habit.id, null);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Clock className="h-4 w-4" />
                    <span className="sr-only">Establecer recordatorio</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xs">
                <DialogHeader>
                    <DialogTitle>Establecer Recordatorio</DialogTitle>
                    <DialogDescription>
                        Elige una hora para recibir un recordatorio diario para "{habit.name}".
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Input
                        type="time"
                        value={time || ''}
                        onChange={(e) => setTime(e.target.value)}
                    />
                </div>
                <DialogFooter className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-2">
                    {habit.reminderTime && (
                        <DialogClose asChild>
                            <Button type="button" variant="outline" onClick={handleRemove}>
                                <BellOff className="mr-2" />
                                Quitar
                            </Button>
                        </DialogClose>
                    )}
                    <DialogClose asChild>
                         <Button type="button" onClick={handleSave} className={cn(!habit.reminderTime && "col-span-2")}>
                            Guardar
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export function HabitList() {
  const { habits, toggleHabit, addHabit, isLoading } = useHabits();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");

  const handleSaveHabit = () => {
    addHabit(newHabitName);
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

  if (isLoading) {
    return (
        <div className="text-center py-10">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">Cargando tus hábitos...</p>
        </div>
    );
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
            <div className="flex-1">
                <Label
                    htmlFor={habit.id}
                    className={cn("text-sm font-medium cursor-pointer", habit.completed && "line-through text-muted-foreground")}
                >
                    {habit.name}
                </Label>
                {habit.reminderTime && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 pt-1">
                        <Clock className="h-3 w-3" />
                        {habit.reminderTime}
                    </p>
                )}
            </div>
            <ReminderDialog habit={habit} />
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
