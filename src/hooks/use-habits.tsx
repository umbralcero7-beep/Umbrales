'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  useUser, 
  useFirestore, 
  useCollection, 
  useMemoFirebase, 
  addDocumentNonBlocking, 
  updateDocumentNonBlocking, 
  setDocumentNonBlocking, 
  deleteDocumentNonBlocking 
} from '@/firebase';
import { collection, doc, writeBatch } from 'firebase/firestore';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { initialHabitsData } from '@/lib/data';

// Habit structure in Firestore
export interface Habit {
  id: string;
  name: string;
  userId: string;
  reminderTime?: string | null;
  createdAt: number;
}

// Habit completion structure in Firestore
export interface HabitCompletion {
  userId: string;
  habitId: string;
  date: string; // YYYY-MM-DD
}

// For UI display
export interface DisplayHabit extends Habit {
  completed: boolean;
}

// Structure for storing completion history for charts
interface HabitHistory {
  [date: string]: string[]; // Key: YYYY-MM-DD, Value: array of completed habit IDs
}

interface HabitsContextType {
  habits: DisplayHabit[];
  history: HabitHistory;
  isLoading: boolean;
  addHabit: (habitName: string) => void;
  toggleHabit: (id: string) => void;
  setHabitReminder: (id: string, time: string | null) => void;
}

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

const getTodayDateString = () => new Date().toISOString().split('T')[0];

export function HabitsProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  // --- Data Fetching from Firestore ---
  const habitsCollectionRef = useMemoFirebase(() => user ? collection(firestore, 'users', user.uid, 'habits') : null, [user, firestore]);
  const { data: firestoreHabits, isLoading: isLoadingHabits } = useCollection<Habit>(habitsCollectionRef);

  const completionsCollectionRef = useMemoFirebase(() => user ? collection(firestore, 'users', user.uid, 'habitCompletions') : null, [user, firestore]);
  const { data: firestoreCompletions, isLoading: isLoadingCompletions } = useCollection<HabitCompletion>(completionsCollectionRef);
  
  // --- Data Seeding for New Users ---
  useEffect(() => {
    // When habits are loaded for a user for the first time
    if (user && !isLoadingHabits && firestoreHabits && firestoreHabits.length === 0) {
      console.log('No habits found for user, seeding initial data...');
      const batch = writeBatch(firestore);
      initialHabitsData.forEach(habitData => {
        // Use a more robust random ID generation
        const habitId = doc(collection(firestore, 'temp')).id;
        const newHabitRef = doc(firestore, 'users', user.uid, 'habits', habitId);
        batch.set(newHabitRef, {
          userId: user.uid,
          name: habitData.name,
          createdAt: Date.now(),
        });
      });
      batch.commit().catch(err => console.error("Error seeding initial habits:", err));
    }
  }, [user, firestoreHabits, isLoadingHabits, firestore]);


  // --- Derived State ---
  const history = useMemo<HabitHistory>(() => {
    if (!firestoreCompletions) return {};
    return firestoreCompletions.reduce((acc, completion) => {
      if (!acc[completion.date]) {
        acc[completion.date] = [];
      }
      acc[completion.date].push(completion.habitId);
      return acc;
    }, {} as HabitHistory);
  }, [firestoreCompletions]);

  const habits = useMemo<DisplayHabit[]>(() => {
    if (!firestoreHabits) return [];
    const today = getTodayDateString();
    const completedTodayIds = new Set(history[today] || []);
    return firestoreHabits
      .map(habit => ({
        ...habit,
        completed: completedTodayIds.has(habit.id),
      }))
      .sort((a, b) => a.createdAt - b.createdAt);
  }, [firestoreHabits, history]);

  // --- Mutations ---
  const addHabit = (habitName: string) => {
    if (!user || !habitsCollectionRef) return;
    if (habitName.trim() === "") {
      toast({
        variant: "destructive",
        title: "El nombre no puede estar vacío",
      });
      return;
    }
    addDocumentNonBlocking(habitsCollectionRef, {
      userId: user.uid,
      name: habitName.trim(),
      createdAt: Date.now(),
    });
    toast({
      title: "¡Hábito Añadido!",
      description: `Has añadido "${habitName.trim()}" a tu lista.`,
    });
  };

  const toggleHabit = (habitId: string) => {
    if (!user) return;
    const today = getTodayDateString();
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const completionId = `${habitId}-${today}`;
    const completionDocRef = doc(firestore, 'users', user.uid, 'habitCompletions', completionId);

    if (habit.completed) {
      // It's currently completed, so we delete the completion doc
      deleteDocumentNonBlocking(completionDocRef);
    } else {
      // It's not completed, so we create the completion doc
      setDocumentNonBlocking(completionDocRef, {
        userId: user.uid,
        habitId: habitId,
        date: today,
      }, {});
      toast({
        title: "¡Hábito completado!",
        description: `¡Buen trabajo en "${habit.name}"!`,
      });
    }
  };

  const setHabitReminder = async (habitId: string, time: string | null) => {
    if (!user) return;
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const habitDocRef = doc(firestore, 'users', user.uid, 'habits', habitId);
    updateDocumentNonBlocking(habitDocRef, { reminderTime: time });

    if (Capacitor.isNativePlatform()) {
        try {
            // Cancel any existing notification for this habit
            await PushNotifications.cancel({ notifications: [{ id: habit.id }] }).catch(e => console.warn("Could not cancel notifications.", e));

            if (time) {
                const [hour, minute] = time.split(':').map(Number);
                await PushNotifications.createChannel({
                    id: 'habit_reminders',
                    name: 'Recordatorios de Hábitos',
                    importance: 4,
                    visibility: 1,
                });
                
                await PushNotifications.schedule({
                    notifications: [{
                        id: habit.id, // Use the stable Firestore document ID
                        channelId: 'habit_reminders',
                        title: 'Recordatorio de Hábito',
                        body: `Es hora de tu hábito: "${habit.name}"`,
                        schedule: { on: { hour, minute }, repeats: true },
                        smallIcon: 'ic_stat_icon_name',
                        largeIcon: 'ic_launcher',
                        // The URL to open when the notification is tapped
                        extra: {
                          url: '/dashboard/habits'
                        }
                    }]
                });

                toast({ title: 'Recordatorio Guardado', description: `Recibirás una notificación para "${habit.name}" a las ${time} en tu dispositivo.` });
            } else {
                 toast({ title: 'Recordatorio Eliminado', description: `Ya no se te recordará sobre "${habit.name}".` });
            }
        } catch (e) {
            console.error("Error scheduling notification:", e);
            toast({ variant: 'destructive', title: 'Error de Notificación', description: 'No se pudo programar el recordatorio.' });
        }
    } else {
        if (time) {
            toast({ title: 'Recordatorio Guardado', description: `Has guardado el recordatorio para "${habit.name}" a las ${time}.` });
        } else {
            toast({ title: 'Recordatorio Eliminado' });
        }
    }
  };

  return (
    <HabitsContext.Provider value={{ habits, history, isLoading: isLoadingHabits || isLoadingCompletions, addHabit, toggleHabit, setHabitReminder }}>
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
