'use client';

import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  PushNotifications,
  Token,
  PushNotificationSchema,
  ActionPerformed,
} from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import { arrayUnion, doc, setDoc } from 'firebase/firestore';

// This component wraps the app and handles all push notification logic.
export function PushNotificationsProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useUser();
  const firestore = useFirestore();

  useEffect(() => {
    // We only want to run this on native mobile platforms, not in the browser.
    if (Capacitor.isNativePlatform()) {
      const registerPush = async () => {
        // Check if permission has already been granted
        let permStatus = await PushNotifications.checkPermissions();

        // If not, request it
        if (permStatus.receive === 'prompt') {
          permStatus = await PushNotifications.requestPermissions();
        }

        // If permission is not granted, we can't do anything.
        if (permStatus.receive !== 'granted') {
          console.warn('User denied push notification permissions.');
          return;
        }

        // On success, the 'registration' event will be emitted with the FCM token.
        await PushNotifications.register();
      };
      
      const addListeners = async () => {
        // Fired when registration is successful
        await PushNotifications.addListener('registration', async (token: Token) => {
          console.log('Push registration success, token: ' + token.value);
          
          if (!user) {
            console.error("No user logged in, cannot store push token.");
            return;
          }

          // Send the token to your backend server to store it.
          const userRef = doc(firestore, 'users', user.uid);
          try {
            // Use set with merge to create the doc if it doesn't exist,
            // and arrayUnion to add the token without creating duplicates.
            await setDoc(userRef, {
              pushTokens: arrayUnion(token.value)
            }, { merge: true });
            console.log('Push token stored in Firestore.');
          } catch (error) {
            console.error('Failed to store push token in Firestore:', error);
          }
        });

        // Fired when registration fails
        await PushNotifications.addListener('registrationError', (error: any) => {
          console.error('Error on registration: ', JSON.stringify(error));
        });

        // Fired when a notification is received while the app is in the foreground
        await PushNotifications.addListener(
          'pushNotificationReceived',
          (notification: PushNotificationSchema) => {
            console.log('Push received: ', notification);
            // Display the notification as a toast inside the app
            toast({
              title: notification.title || "Nueva Notificación",
              description: notification.body,
            });
          },
        );

        // Fired when the user taps on a notification
        await PushNotifications.addListener(
          'pushNotificationActionPerformed',
          (action: ActionPerformed) => {
            console.log('Push action performed: ', action);
            const data = action.notification.data;
            // If the notification has a 'url' in its data, navigate to it.
            if (data.url) {
              router.push(data.url);
            }
          },
        );
      }

      if (user) {
        addListeners();
        registerPush();
      }
    }
  }, [toast, router, user, firestore]);

  return <>{children}</>;
}
