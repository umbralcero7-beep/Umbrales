import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';

// --- Firebase Admin Initialization ---
// This block ensures Firebase Admin is initialized only once.
if (!admin.apps.length) {
  // In a real Vercel environment, you would use environment variables.
  // Make sure to add these to your Vercel project settings.
  // IMPORTANT: The service account JSON must be stored securely as a single
  // environment variable in Vercel.
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON!);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase Admin initialized successfully.");
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error);
    // If initialization fails, we cannot proceed.
    // Return a server error response in the handler below.
  }
}
// --- End of Initialization ---

export async function GET(request: Request) {
  // Step 1: Secure the endpoint
  // Vercel Cron Jobs can send a secret token in the 'Authorization' header.
  // You should check for it here to prevent abuse.
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.warn("Unauthorized cron job access attempt.");
    return new Response('Unauthorized', { status: 401 });
  }

  // Check if Firebase Admin failed to initialize
  if (!admin.apps.length) {
    console.error("Cron job cannot run because Firebase Admin is not initialized.");
    return NextResponse.json({ success: false, error: 'Firebase Admin not initialized.' }, { status: 500 });
  }

  // Step 2: Implement the reminder logic
  const db = getFirestore();
  const messaging = getMessaging();
  
  // Note: Vercel runs in UTC. Time logic needs to be robust.
  // This basic example compares against the server's current time in HH:MM format.
  const now = new Date();
  const currentHour = now.getUTCHours();
  const currentMinute = now.getUTCMinutes();
  const currentTime = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;

  console.log(`Cron job running at UTC time: ${currentTime}`);

  try {
    // Find all habits across all users that have a reminder set for the current time.
    const habitsSnapshot = await db.collectionGroup('habits')
                                   .where('reminderTime', '==', currentTime)
                                   .get();

    if (habitsSnapshot.empty) {
      console.log('No habits to remind at this time.');
      return NextResponse.json({ success: true, message: 'No habits to remind.' });
    }

    const reminderJobs = habitsSnapshot.docs.map(async (habitDoc) => {
      const habit = habitDoc.data();
      const userId = habit.userId;

      if (!userId) {
        console.warn(`Habit ${habitDoc.id} is missing a userId.`);
        return;
      }

      // Get the user's push tokens
      const userDoc = await db.collection('users').doc(userId).get();
      const user = userDoc.data();

      // Check if the user has any push tokens
      if (user && user.pushTokens && user.pushTokens.length > 0) {
        const messagePayload = {
          notification: {
            title: 'Recordatorio de Hábito',
            body: `Es hora de tu hábito: "${habit.name}"`,
          },
          tokens: user.pushTokens, // `sendEachForMulticast` expects an array of tokens
        };

        console.log(`Sending notification for habit "${habit.name}" to user ${userId}`);
        return messaging.sendEachForMulticast(messagePayload);
      } else {
        console.log(`User ${userId} has no push tokens for habit "${habit.name}".`);
      }
    });

    await Promise.all(reminderJobs);

    return NextResponse.json({ success: true, message: `Sent reminders for ${habitsSnapshot.size} habits.` });

  } catch (error) {
    console.error('Error sending reminders:', error);
    return NextResponse.json({ success: false, error: 'Failed to process reminders.' }, { status: 500 });
  }
}
