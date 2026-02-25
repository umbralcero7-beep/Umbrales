import * as functions from 'firebase-functions';
/**
 * Cloud Function: Send habit reminders
 * Runs every minute to check if any user has a habit reminder scheduled for the current time
 */
export declare const sendHabitReminders: functions.CloudFunction<unknown>;
/**
 * Cloud Function: Clean up old habit completions
 * Runs daily to clean up habit completions older than 90 days
 */
export declare const cleanupOldCompletions: functions.CloudFunction<unknown>;
