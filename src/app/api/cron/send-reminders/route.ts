import { NextResponse } from 'next/server';

// IMPORTANT: The following imports are for demonstration and will NOT work
// without the 'firebase-admin' package being added to package.json.
// This backend logic must be completed by a developer with access to the server environment.
/*
import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';

// In a real Vercel environment, you would use environment variables.
// Make sure to add these to your Vercel project settings.
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}
*/

export async function GET(request: Request) {
  // IMPORTANT: This endpoint must be secured!
  // Vercel Cron Jobs can send a secret token in the 'Authorization' header.
  // You should check for it here to prevent abuse.
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }

  const message = `
    This endpoint is a placeholder for a cron job to send habit reminders.
    A developer needs to complete the following steps:
    
    1. Add 'firebase-admin' to package.json: npm install firebase-admin
    2. Add your Firebase service account credentials as environment variables in Vercel:
       - FIREBASE_PROJECT_ID
       - FIREBASE_CLIENT_EMAIL
       - FIREBASE_PRIVATE_KEY
    3. Add the CRON_SECRET from your .env file to your Vercel environment variables.
    4. Uncomment the 'firebase-admin' logic below.
    5. Configure this route as a Cron Job in your 'vercel.json' or Vercel dashboard.
       Example 'vercel.json':
       {
         "crons": [
           {
             "path": "/api/cron/send-reminders",
             "schedule": "0 * * * *"
           }
         ]
       }
  `;

  console.log(message);

  /*
  // === TEMPLATE LOGIC USING FIREBASE-ADMIN ===

  const db = getFirestore();
  const messaging = getMessaging();
  const now = new Date();
  // Note: Vercel runs in UTC. Adjust time logic as needed for your users' timezones.
  // This basic example compares against the server's current time.
  const currentHour = now.getUTCHours();
  const currentMinute = now.getUTCMinutes();
  const currentTime = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;

  console.log(`Cron job running at UTC time: ${currentTime}`);

  try {
    // Find habits that have a reminder set for the current time
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

      const userDoc = await db.collection('users').doc(userId).get();
      const user = userDoc.data();

      if (user && user.pushTokens && user.pushTokens.length > 0) {
        const messagePayload = {
          notification: {
            title: 'Recordatorio de Hábito',
            body: `Es hora de tu hábito: "${habit.name}"`,
          },
          tokens: user.pushTokens,
        };

        console.log(`Sending notification for habit "${habit.name}" to user ${userId}`);
        return messaging.sendEachForMulticast(messagePayload);
      }
    });

    await Promise.all(reminderJobs);

    return NextResponse.json({ success: true, message: 'Reminder check completed.' });

  } catch (error) {
    console.error('Error sending reminders:', error);
    return NextResponse.json({ success: false, error: 'Failed to process reminders.' }, { status: 500 });
  }
  */

  return NextResponse.json({ success: true, message: 'Cron job endpoint is set up. See logs for implementation steps.' });
}
