'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { JournalEntry } from '@/lib/data';
import type { AnalyzeJournalEntryOutput } from '@/ai/flows/analyze-journal-entry';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase';

interface JournalContextType {
  entries: JournalEntry[];
  addJournalEntry: (content: string, analysis: AnalyzeJournalEntryOutput) => void;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

const getStorageKey = (userId: string) => `umbral_journal_entries_${userId}`;

export function JournalProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const { user } = useUser();
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    if (user) {
        try {
            const storageKey = getStorageKey(user.uid);
            const storedJson = localStorage.getItem(storageKey);
            if (storedJson) {
                setEntries(JSON.parse(storedJson));
            } else {
                setEntries([]);
            }
        } catch (error) {
            console.error("Error reading journal entries from localStorage", error);
            setEntries([]);
        }
    } else {
        setEntries([]);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
        try {
            const storageKey = getStorageKey(user.uid);
            localStorage.setItem(storageKey, JSON.stringify(entries));
        } catch (error) {
            console.error("Error saving journal entries to localStorage", error);
        }
    }
  }, [entries, user]);

  const addJournalEntry = (content: string, analysis: AnalyzeJournalEntryOutput) => {
    const newEntry: JournalEntry = {
      id: `entry-${Date.now()}`,
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
      content,
      analysis,
    };

    setEntries((prevEntries) => [newEntry, ...prevEntries]);
    
    toast({
      title: "Entrada Guardada",
      description: "Tu reflexión ha sido guardada en tus entradas anteriores.",
    });
  };

  return (
    <JournalContext.Provider value={{ entries, addJournalEntry }}>
      {children}
    </JournalContext.Provider>
  );
}

export function useJournal() {
  const context = useContext(JournalContext);
  if (context === undefined) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
}
