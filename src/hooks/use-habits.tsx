'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { habits as initialHabits, type Habit } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

interface HabitsContextType {
  habits: Habit[];
  addHabit: (habitName: string) => void;
  toggleHabit: (id: string) => void;
}

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

const HABITS_STORAGE_KEY = 'umbral_habits';

export function HabitsProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  // Initialize with initialHabits to ensure server and client match on first render.
  const [habits, setHabits] = useState<Habit[]>(initialHabits);

  // After the component mounts on the client, load the habits from localStorage.
  useEffect(() => {
    try {
        const storedHabits = localStorage.getItem(HABITS_STORAGE_KEY);
        if (storedHabits) {
            setHabits(JSON.parse(storedHabits));
        }
    } catch (error) {
        console.error("Error reading habits from localStorage", error);
    }
  }, []); // Empty dependency array ensures this runs only once on mount.

  // Persist habits to localStorage whenever they change.
  useEffect(() => {
    // This effect runs only on the client, so no need for `typeof window` check.
    try {
        localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
    } catch (error) {
        console.error("Error saving habits to localStorage", error);
    }
  }, [habits]);

  const addHabit = (habitName: string) => {
    if (habitName.trim() === "") {
        toast({
            variant: "destructive",
            title: "El nombre no puede estar vacío",
            description: "Por favor, escribe un nombre para tu hábito.",
        });
        return;
    }

    const newHabit: Habit = {
        id: `habit-${Date.now()}`,
        name: habitName.trim(),
        completed: false,
    };

    setHabits((prevHabits) => [...prevHabits, newHabit]);
    toast({
        title: "¡Hábito Añadido!",
        description: `Has añadido "${newHabit.name}" a tu lista.`,
    });
  };

  const toggleHabit = (id: string) => {
    const habit = habits.find(h => h.id === id);
    setHabits(
      habits.map((h) =>
        h.id === id ? { ...h, completed: !h.completed } : h
      )
    );
    if (habit && !habit.completed) {
        toast({
            title: "¡Hábito completado!",
            description: `¡Buen trabajo en "${habit.name}"!`,
        });
    }
  };

  return (
    <HabitsContext.Provider value={{ habits, addHabit, toggleHabit }}>
      {children}
    </HabitsContext.Provider>
  );
}

export function useHabits() {
  const context = useContext(HabitsContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitsProvider');
  }
  return context;
}
