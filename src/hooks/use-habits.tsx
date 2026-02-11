'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { habits as initialHabitsData, type Habit as HabitWithCompletion } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

// Base habit definition, stored without completion status
export type Habit = Omit<HabitWithCompletion, 'completed'>;
// Habit type for UI, with completion status for the current day
export type DisplayHabit = HabitWithCompletion;

// Structure for storing completion history
interface HabitHistory {
  [date: string]: string[]; // Key: YYYY-MM-DD, Value: array of completed habit IDs
}

interface HabitsContextType {
  habits: DisplayHabit[]; // Derived state for UI
  history: HabitHistory; // Full history for charts
  addHabit: (habitName: string) => void;
  toggleHabit: (id: string) => void;
  setHabitReminder: (id: string, time: string | null) => void;
}

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

// Use a new key to avoid conflicts with old data structure
const HABITS_STORAGE_KEY = 'umbral_habits_v2'; 
const getTodayDateString = () => new Date().toISOString().split('T')[0];

export function HabitsProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  
  // State for base habit configurations (id, name, reminder)
  const [baseHabits, setBaseHabits] = useState<Habit[]>([]);
  // State for completion history
  const [history, setHistory] = useState<HabitHistory>({});

  // Push notification permission setup
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      PushNotifications.checkPermissions().then(status => {
        if (status.receive !== 'granted') {
          PushNotifications.requestPermissions().then(result => {
            if (result.receive !== 'granted') {
              toast({
                variant: 'destructive',
                title: 'Permiso denegado',
                description: 'No se podrán enviar recordatorios de hábitos.',
              });
            }
          });
        }
      });
    }
  }, [toast]);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const storedJson = localStorage.getItem(HABITS_STORAGE_KEY);
      if (storedJson) {
        const { habits, history: storedHistory } = JSON.parse(storedJson);
        setBaseHabits(habits || []);
        setHistory(storedHistory || {});
      } else {
        // Set initial data if no modern storage found
        const cleanInitialHabits = initialHabitsData.map(({ completed, ...rest }) => rest);
        setBaseHabits(cleanInitialHabits);
      }
    } catch (error) {
      console.error("Error reading habits from localStorage", error);
      const cleanInitialHabits = initialHabitsData.map(({ completed, ...rest }) => rest);
      setBaseHabits(cleanInitialHabits);
    }
  }, []);

  // Persist data to localStorage whenever it changes
  useEffect(() => {
    // Avoid saving if state is empty before hydration is complete
    if (baseHabits.length === 0 && Object.keys(history).length === 0) {
      if (localStorage.getItem(HABITS_STORAGE_KEY) === null) {
        return;
      }
    }
    try {
      const dataToStore = { habits: baseHabits, history };
      localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(dataToStore));
    } catch (error) {
      console.error("Error saving habits to localStorage", error);
    }
  }, [baseHabits, history]);

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
    };
    setBaseHabits((prev) => [...prev, newHabit]);
    toast({
        title: "¡Hábito Añadido!",
        description: `Has añadido "${newHabit.name}" a tu lista.`,
    });
  };

  const toggleHabit = (id: string) => {
    const today = getTodayDateString();
    const habit = baseHabits.find(h => h.id === id);
    if (!habit) return;

    const completedToday = new Set(history[today] || []);
    let isCompleting: boolean;

    if (completedToday.has(id)) {
      completedToday.delete(id);
      isCompleting = false;
    } else {
      completedToday.add(id);
      isCompleting = true;
    }
    
    setHistory(prev => ({ ...prev, [today]: Array.from(completedToday) }));
    
    if (isCompleting) {
        toast({
            title: "¡Hábito completado!",
            description: `¡Buen trabajo en "${habit.name}"!`,
        });
    }
  };

  const setHabitReminder = async (id: string, time: string | null) => {
    const habit = baseHabits.find(h => h.id === id);
    if (!habit) return;

    // Persist the reminder time
    setBaseHabits(habits => habits.map(h => h.id === id ? { ...h, reminderTime: time } : h));

    if (Capacitor.isNativePlatform()) {
      const notificationId = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 10000;

      await PushNotifications.cancel({ notifications: [{ id: notificationId }] });

      if (time) {
          const [hour, minute] = time.split(':').map(Number);
          try {
              await PushNotifications.schedule({
                  notifications: [
                      {
                          id: notificationId,
                          title: `Recordatorio de Hábito: ${habit.name}`,
                          body: `¡Es hora de completar tu hábito diario! No te rindas.`,
                          schedule: { on: { hour, minute }, repeats: true },
                          sound: 'default',
                          smallIcon: 'ic_stat_icon_config_sample',
                      },
                  ],
              });
              toast({
                  title: 'Recordatorio establecido',
                  description: `Se te recordará sobre "${habit.name}" todos los días a las ${time}.`,
              });
          } catch (error) {
              console.error("Error scheduling notification", error);
              toast({
                  variant: "destructive",
                  title: "Error al guardar recordatorio",
                  description: "No se pudo establecer el recordatorio. Asegúrate de haber otorgado permisos.",
              });
          }
      } else {
          toast({
              title: 'Recordatorio eliminado',
              description: `Ya no se te recordará sobre "${habit.name}".`,
          });
      }
    } else {
      if (time) {
        toast({
          title: 'Recordatorio Guardado',
          description: 'Las notificaciones push solo están disponibles en la app móvil.',
        });
      } else {
        toast({
            title: 'Recordatorio eliminado',
            description: `Ya no se te recordará sobre "${habit.name}".`,
        });
      }
    }
  };

  // Derive the habits to display in the UI for the current day
  const habitsForDisplay: DisplayHabit[] = React.useMemo(() => {
    const today = getTodayDateString();
    const completedTodayIds = new Set(history[today] || []);
    return baseHabits.map(habit => ({
      ...habit,
      completed: completedTodayIds.has(habit.id),
    }));
  }, [baseHabits, history]);

  return (
    <HabitsContext.Provider value={{ habits: habitsForDisplay, history, addHabit, toggleHabit, setHabitReminder }}>
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
