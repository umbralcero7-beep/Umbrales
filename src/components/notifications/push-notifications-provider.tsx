'use client';

import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { CapacitorPushInitializer } from './capacitor-push-initializer';

// This component wraps the app and handles all push notification logic.
export function PushNotificationsProvider({ children }: { children: React.ReactNode }) {
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    // Check if running on a native platform after the component has mounted.
    // This avoids server-side rendering issues.
    setIsNative(Capacitor.isNativePlatform());
  }, []);

  return (
    <>
      {children}
      {isNative && <CapacitorPushInitializer />}
    </>
  );
}
