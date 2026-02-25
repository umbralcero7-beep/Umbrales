'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@/firebase';

export interface MoodLog {
  date: string; // YYYY-MM-DD format
  mood: string;
}

interface MoodContextType {
  moods: MoodLog[];
  addMoodLog: (mood: string) => void;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

const getStorageKey = (userId: string) => `umbral_mood_logs_v1_${userId}`;

export function MoodProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [moods, setMoods] = useState<MoodLog[]>([]);

  useEffect(() => {
    if (user) {
        try {
            const storageKey = getStorageKey(user.uid);
            const storedJson = localStorage.getItem(storageKey);
            if (storedJson) {
                setMoods(JSON.parse(storedJson));
            } else {
                // Seed initial data for new users for demo purposes
                const today = new Date();
                const demoMoods = ['Feliz', 'Calmado', 'Ansioso', 'Triste', 'Cansado', 'Calmado', 'Pensativo'];
                const initialMoods = Array.from({ length: 7 }).map((_, i) => {
                    const date = new Date();
                    date.setDate(today.getDate() - (6 - i));
                    return {
                        date: date.toISOString().split('T')[0],
                        mood: demoMoods[i % demoMoods.length],
                    };
                });
                setMoods(initialMoods);
            }
        } catch (error) {
            console.error("Error reading mood logs from localStorage", error);
            setMoods([]);
        }
    } else {
        setMoods([]);
    }
  }, [user]);

  useEffect(() => {
    if (user && moods.length > 0) {
        try {
            const storageKey = getStorageKey(user.uid);
            localStorage.setItem(storageKey, JSON.stringify(moods));
        } catch (error) {
            console.error("Error saving mood logs to localStorage", error);
        }
    }
  }, [moods, user]);

  const addMoodLog = (mood: string) => {
    const today = new Date().toISOString().split('T')[0];
    const newLog: MoodLog = {
      date: today,
      mood,
    };
    
    setMoods(prevMoods => {
        const otherDays = prevMoods.filter(m => m.date !== today);
        return [...otherDays, newLog];
    });
  };

  return (
    <MoodContext.Provider value={{ moods, addMoodLog }}>
      {children}
    </MoodContext.Provider>
  );
}

export function useMood() {
  const context = useContext(MoodContext);
  if (context === undefined) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
}
