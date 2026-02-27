'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@/firebase';
import type { GetAdviceForMoodOutput } from '@/ai/flows/get-advice-for-mood';

export interface MoodLog {
  date: string; // YYYY-MM-DD format
  mood: string;
}

export interface TodaysInsight {
    date: string; // YYYY-MM-DD
    insight: GetAdviceForMoodOutput;
}

interface MoodContextType {
  moods: MoodLog[];
  addMoodLog: (mood: string) => void;
  todaysInsight: GetAdviceForMoodOutput | null;
  setTodaysInsight: (insight: GetAdviceForMoodOutput) => void;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

const getMoodStorageKey = (userId: string) => `umbral_mood_logs_v1_${userId}`;
const getInsightStorageKey = (userId: string) => `umbral_insight_v1_${userId}`;

export function MoodProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [moods, setMoods] = useState<MoodLog[]>([]);
  const [todaysInsight, setTodaysInsightState] = useState<TodaysInsight | null>(null);

  useEffect(() => {
    if (user) {
        // Load moods
        try {
            const moodKey = getMoodStorageKey(user.uid);
            const storedMoodsJson = localStorage.getItem(moodKey);
            if (storedMoodsJson) {
                setMoods(JSON.parse(storedMoodsJson));
            } else {
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

        // Load today's insight
        try {
            const insightKey = getInsightStorageKey(user.uid);
            const storedInsightJson = localStorage.getItem(insightKey);
            if (storedInsightJson) {
                const storedInsight = JSON.parse(storedInsightJson);
                const today = new Date().toISOString().split('T')[0];
                if (storedInsight.date === today) {
                    setTodaysInsightState(storedInsight);
                } else {
                    localStorage.removeItem(insightKey); // Stale insight
                }
            }
        } catch (error) {
            console.error("Error reading insight from localStorage", error);
        }
    } else {
        setMoods([]);
        setTodaysInsightState(null);
    }
  }, [user]);

  useEffect(() => {
    if (user && moods.length > 0) {
        try {
            const storageKey = getMoodStorageKey(user.uid);
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

  const setTodaysInsight = (insight: GetAdviceForMoodOutput) => {
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    const insightToStore: TodaysInsight = { date: today, insight };
    setTodaysInsightState(insightToStore);
    try {
        localStorage.setItem(getInsightStorageKey(user.uid), JSON.stringify(insightToStore));
    } catch (error) {
        console.error("Error saving insight to localStorage", error);
    }
  };

  const derivedInsight = (todaysInsight && todaysInsight.date === new Date().toISOString().split('T')[0]) ? todaysInsight.insight : null;

  return (
    <MoodContext.Provider value={{ moods, addMoodLog, todaysInsight: derivedInsight, setTodaysInsight }}>
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
