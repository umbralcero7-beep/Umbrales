'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface UserContextType {
  userEmail: string | null;
  login: (email: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'umbral_user_email';

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsLoading(true);
    try {
      const storedEmail = localStorage.getItem(USER_STORAGE_KEY);
      if (storedEmail) {
        setUserEmail(storedEmail);
      }
    } catch (error) {
      console.error("Error reading user from localStorage", error);
    } finally {
        setIsLoading(false);
    }
  }, []);

  const login = useCallback((email: string) => {
    localStorage.setItem(USER_STORAGE_KEY, email);
    setUserEmail(email);
    // Don't push to dashboard if already on an onboarding step
    if (!pathname.startsWith('/register')) {
        router.push('/dashboard');
    }
  }, [router, pathname]);

  const logout = useCallback(() => {
    localStorage.removeItem(USER_STORAGE_KEY);
    setUserEmail(null);
    router.push('/');
  }, [router]);

  return (
    <UserContext.Provider value={{ userEmail, login, logout, isLoading }}>
      {isLoading ? (
          <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
      ) : children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
