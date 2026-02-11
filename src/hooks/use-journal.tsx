'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { JournalEntry } from '@/lib/data';
import type { AnalyzeJournalEntryOutput } from '@/ai/flows/analyze-journal-entry';
import { useToast } from '@/hooks/use-toast';

interface JournalContextType {
  entries: JournalEntry[];
  addJournalEntry: (content: string, analysis: AnalyzeJournalEntryOutput) => void;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

const JOURNAL_STORAGE_KEY = 'umbral_journal_entries';

export function JournalProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    try {
      const storedJson = localStorage.getItem(JOURNAL_STORAGE_KEY);
      if (storedJson) {
        setEntries(JSON.parse(storedJson));
      }
    } catch (error) {
      console.error("Error reading journal entries from localStorage", error);
      setEntries([]);
    }
  }, []);

  useEffect(() => {
    if (entries.length === 0 && localStorage.getItem(JOURNAL_STORAGE_KEY) === null) {
      return;
    }
    try {
      localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error("Error saving journal entries to localStorage", error);
    }
  }, [entries]);

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
