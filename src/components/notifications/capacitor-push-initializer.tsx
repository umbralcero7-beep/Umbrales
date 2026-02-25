'use client';

import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import { arrayUnion, doc, setDoc } from 'firebase/firestore';

// This component contains all Capacitor-specific logic and is only rendered on native platforms.
export function CapacitorPushInitializer() {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useUser();
  const firestore = useFirestore();

  useEffect(() => {
    // This function will contain all logic and imports.
    const initializePushNotifications = async () => {
      // Dynamically import Capacitor plugins only when this component is mounted on a native platform.
      const { PushNotifications } = await import('@capacitor/push-notifications');

      const addListeners = async () => {
        await PushNotifications.addListener('registration', async (token) => {
          console.log('Push registration success, token: ' + token.value);
          if (!user) {
            console.error("No user logged in, cannot store push token.");
            return;
          }
          const userRef = doc(firestore, 'users', user.uid);
          try {
            await setDoc(userRef, {
              pushTokens: arrayUnion(token.value)
            }, { merge: true });
            console.log('Push token stored in Firestore.');
          } catch (error) {
            console.error('Failed to store push token in Firestore:', error);
          }
        });

        await PushNotifications.addListener('registrationError', (error: any) => {
          console.error('Error on registration: ', JSON.stringify(error));
        });

        await PushNotifications.addListener('pushNotificationReceived', (notification) => {
          console.log('Push received: ', notification);
          toast({
            title: notification.title || "Nueva Notificación",
            description: notification.body,
          });
        });

        await PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
          console.log('Push action performed: ', action);
          const data = action.notification.data;
          if (data.url) {
            router.push(data.url);
          }
        });
      };

      const registerPush = async () => {
        let permStatus = await PushNotifications.checkPermissions();
        if (permStatus.receive === 'prompt') {
          permStatus = await PushNotifications.requestPermissions();
        }
        if (permStatus.receive !== 'granted') {
          console.warn('User denied push notification permissions.');
          return;
        }
        await PushNotifications.register();
      };
      
      if (user) {
        addListeners();
        registerPush();
      }
    };
    
    initializePushNotifications();

  }, [user, firestore, router, toast]);

  return null; // This component renders nothing.
}
