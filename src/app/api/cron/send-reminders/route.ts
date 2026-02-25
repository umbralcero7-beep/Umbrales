// This route is explicitly made static to comply with the `output: 'export'` configuration.
// It returns a 404 to indicate that the server-side cron job is disabled in favor of local notifications.
export const dynamic = 'force-static';

export async function GET() {
  // Using a minimal, native Response to be as static-friendly as possible.
  // This prevents Next.js from trying to run server-side logic during the build.
  return new Response(
    'This API route is disabled. Reminder logic is handled by client-side local notifications.',
    {
      status: 404,
      headers: { 'Content-Type': 'text/plain' },
    }
  );
}
