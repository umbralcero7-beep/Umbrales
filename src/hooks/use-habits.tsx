'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  useUser, 
  useFirestore, 
  useCollection, 
  useMemoFirebase, 
  addDocumentNonBlocking, 
  setDocumentNonBlocking, 
  deleteDocumentNonBlocking 
} from '@/firebase';
import { collection, doc, writeBatch, updateDoc } from 'firebase/firestore';
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
  importHabits: (habitsToImport: { name: string }[]) => void;
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

  const importHabits = (habitsToImport: { name: string }[]) => {
    if (!user || !firestore) return;
    if (habitsToImport.length === 0) {
      toast({
        variant: "destructive",
        title: "Archivo vacío o formato incorrecto",
        description: "Asegúrate de que el archivo CSV tenga un encabezado y al menos una fila.",
      });
      return;
    }

    const batch = writeBatch(firestore);
    const habitsCollectionRefForBatch = collection(firestore, 'users', user.uid, 'habits');

    habitsToImport.forEach(habit => {
      if (habit.name.trim() !== "") {
        const newHabitRef = doc(habitsCollectionRefForBatch);
        batch.set(newHabitRef, {
          userId: user.uid,
          name: habit.name.trim(),
          createdAt: Date.now(),
        });
      }
    });

    batch.commit().then(() => {
      toast({
        title: "¡Importación Exitosa!",
        description: `Se han importado ${habitsToImport.length} hábitos.`,
      });
    }).catch(err => {
      console.error("Error importando hábitos:", err);
      toast({
        variant: "destructive",
        title: "Error en la importación",
        description: "No se pudieron guardar los hábitos. Inténtalo de nuevo.",
      });
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
    
    // --- NATIVE MOBILE LOGIC ---
    if (Capacitor.isNativePlatform()) {
      try {
        // 1. Check for permissions if we are SETTING a reminder
        if (time) {
          console.log('Checking push notification permissions...');
          let permStatus = await PushNotifications.checkPermissions();
          console.log('Initial permission status:', permStatus.receive);

          if (permStatus.receive === 'prompt' || permStatus.receive === 'prompt-with-rationale') {
            console.log('Requesting push notification permissions...');
            permStatus = await PushNotifications.requestPermissions();
            console.log('New permission status after request:', permStatus.receive);
          }

          if (permStatus.receive !== 'granted') {
            console.error('Permission not granted. Status:', permStatus.receive);
            toast({
              variant: 'destructive',
              title: 'Permiso Requerido',
              description: 'No se pueden programar recordatorios sin permiso para notificaciones.',
            });
            return; // Stop if permission is denied
          }
          console.log('Permissions are granted.');
        }
        
        // 2. Update Firestore (now blocking to ensure consistency)
        await updateDoc(habitDocRef, { reminderTime: time });

        // 3. Manage device notifications
        await PushNotifications.cancel({ notifications: [{ id: habit.id }] }).catch(e => console.warn("Could not cancel notifications.", e));
        console.log(`Cancelled any existing notifications for habit ID: ${habit.id}`);

        if (time) {
          const [hour, minute] = time.split(':').map(Number);
          await PushNotifications.createChannel({
            id: 'habit_reminders',
            name: 'Recordatorios de Hábitos',
            importance: 4,
            visibility: 1,
          });
          
          console.log(`Scheduling notification for habit "${habit.name}" at ${time}`);
          await PushNotifications.schedule({
            notifications: [{
              id: habit.id,
              channelId: 'habit_reminders',
              title: 'Recordatorio de Hábito',
              body: `Es hora de tu hábito: "${habit.name}"`,
              schedule: { on: { hour, minute }, repeats: true },
              smallIcon: 'ic_stat_icon_name',
              largeIcon: 'ic_launcher',
              extra: { url: '/dashboard/habits' }
            }]
          });
          console.log('Notification scheduled successfully.');

          toast({ title: 'Recordatorio Guardado', description: `Recibirás una notificación para "${habit.name}" a las ${time} en tu dispositivo.` });
        } else {
          console.log('Reminder time is null, clearing notifications.');
          toast({ title: 'Recordatorio Eliminado', description: `Ya no se te recordará sobre "${habit.name}".` });
        }
      } catch (e: any) {
        console.error("Full error object in setHabitReminder:", e);
        toast({ variant: 'destructive', title: 'Error de Notificación', description: `No se pudo programar el recordatorio. ${e.message}` });
      }
    } else {
      // --- BROWSER LOGIC (no change) ---
      await updateDoc(habitDocRef, { reminderTime: time });
      if (time) {
        toast({ title: 'Recordatorio Guardado', description: `Has guardado el recordatorio para "${habit.name}" a las ${time}.` });
      } else {
        toast({ title: 'Recordatorio Eliminado' });
      }
    }
  };

  return (
    <HabitsContext.Provider value={{ habits, history, isLoading: isLoadingHabits || isLoadingCompletions, addHabit, toggleHabit, setHabitReminder, importHabits }}>
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
