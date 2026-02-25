import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp();

const db = admin.firestore();
const messaging = admin.messaging();

/**
 * Cloud Function: Send habit reminders
 * Runs every minute to check if any user has a habit reminder scheduled for the current time
 */
export const sendHabitReminders = functions.pubsub
  .schedule('every 1 minutes')
  .timeZone('America/Bogota') // Adjust timezone as needed
  .onRun(async (context) => {
    try {
      console.log('Starting sendHabitReminders job at', new Date().toISOString());

      // Get current time in HH:mm format
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      console.log(`Current time: ${currentTime}`);

      // Get all users
      const usersSnapshot = await db.collection('users').get();
      console.log(`Found ${usersSnapshot.size} users`);

      let remindersProcessed = 0;
      let remindersSent = 0;
      let remindersWithError = 0;

      // Process each user
      for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;
        const userData = userDoc.data();
        const pushTokens = userData.pushTokens || [];

        if (pushTokens.length === 0) {
          console.log(`User ${userId} has no push tokens`);
          continue;
        }

        // Get all habits for this user
        const habitsSnapshot = await userDoc.ref.collection('habits').get();
        console.log(`User ${userId} has ${habitsSnapshot.size} habits`);

        // Check each habit
        for (const habitDoc of habitsSnapshot.docs) {
          const habit = habitDoc.data();
          const reminderTime = habit.reminderTime;

          if (!reminderTime) {
            continue; // Skip habits without reminder time
          }

          remindersProcessed++;
          console.log(`Checking habit: ${habit.name} (reminder: ${reminderTime})`);

          // Check if current time matches reminder time
          if (reminderTime === currentTime) {
            console.log(`Sending reminder for habit: ${habit.name} to user ${userId}`);

            try {
              // Send notification to all user's push tokens
              const multicastMessage = {
                notification: {
                  title: '🎯 Recordatorio de Hábito',
                  body: `Es hora de: ${habit.name}`,
                },
                data: {
                  habitId: habitDoc.id,
                  habitName: habit.name,
                  url: '/dashboard/habits',
                },
                webpush: {
                  notification: {
                    icon: '/logo.svg',
                    badge: '/logo.svg',
                    title: '🎯 Recordatorio de Hábito',
                    body: `Es hora de: ${habit.name}`,
                  },
                },
                android: {
                  priority: 'high',
                  notification: {
                    channelId: 'habit_reminders',
                    title: '🎯 Recordatorio de Hábito',
                    body: `Es hora de: ${habit.name}`,
                    sound: 'default',
                  },
                },
              };

              const response = await messaging.sendEachForMulticast(
                multicastMessage as any,
                pushTokens
              );

              console.log(
                `Successfully sent ${response.successCount} notifications to user ${userId} for habit ${habit.name}`
              );

              // Remove invalid tokens
              if (response.failureCount > 0) {
                const invalidTokens: string[] = [];
                response.responses.forEach((resp, idx) => {
                  if (!resp.success) {
                    const err = resp.error;
                    const errorCode =
                      err && 'code' in err && err.code
                        ? (err.code as string)
                        : 'unknown';

                    // Codes that indicate the token is invalid and should be removed
                    if (
                      ['messaging/invalid-registration-token',
                       'messaging/registration-token-not-registered',
                       'messaging/mismatched-sender-id'].includes(errorCode)
                    ) {
                      invalidTokens.push(pushTokens[idx]);
                    }
                  }
                });

                // Remove invalid tokens from Firestore
                if (invalidTokens.length > 0) {
                  console.log(`Removing ${invalidTokens.length} invalid tokens for user ${userId}`);
                  await userDoc.ref.update({
                    pushTokens: admin.firestore.FieldValue.arrayRemove(...invalidTokens),
                  });
                }
              }

              remindersSent++;
            } catch (error) {
              remindersWithError++;
              console.error(
                `Error sending reminder for habit ${habit.name} to user ${userId}:`,
                error
              );
            }
          }
        }
      }

      console.log(
        `Job completed. Processed: ${remindersProcessed}, Sent: ${remindersSent}, Errors: ${remindersWithError}`
      );
      return null;
    } catch (error) {
      console.error('Error in sendHabitReminders:', error);
      throw error;
    }
  });

/**
 * Cloud Function: Clean up old habit completions
 * Runs daily to clean up habit completions older than 90 days
 */
export const cleanupOldCompletions = functions.pubsub
  .schedule('0 3 * * *') // 3:00 AM daily
  .timeZone('America/Bogota')
  .onRun(async (context) => {
    try {
      console.log('Starting cleanupOldCompletions job');

      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      const usersSnapshot = await db.collection('users').get();

      for (const userDoc of usersSnapshot.docs) {
        const completionsSnapshot = await userDoc.ref
          .collection('habits')
          .get();

        const batch = db.batch();
        let deleteCount = 0;

        for (const completionDoc of completionsSnapshot.docs) {
          const completion = completionDoc.data();
          const completionDate = completion.date instanceof admin.firestore.Timestamp
            ? completion.date.toDate()
            : (completion.date instanceof Date ? completion.date : new Date(completion.date));

          if (completionDate < ninetyDaysAgo) {
            batch.delete(completionDoc.ref);
            deleteCount++;
          }
        }

        if (deleteCount > 0) {
          await batch.commit();
          console.log(`Deleted ${deleteCount} old completions for user ${userDoc.id}`);
        }
      }

      console.log('cleanupOldCompletions job completed');
      return null;
    } catch (error) {
      console.error('Error in cleanupOldCompletions:', error);
      throw error;
    }
  });
