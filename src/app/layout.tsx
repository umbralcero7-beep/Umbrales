import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import { PushNotificationsProvider } from '@/components/notifications/push-notifications-provider';
import { HabitsProvider } from '@/hooks/use-habits';
import { JournalProvider } from '@/hooks/use-journal';

export const metadata: Metadata = {
  title: 'Umbral',
  description: 'Un santuario digital para el bienestar mental y el crecimiento personal.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4B8B6D" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased")}>
        <ThemeProvider defaultTheme='zen'>
          <PushNotificationsProvider>
            <HabitsProvider>
              <JournalProvider>
                {children}
              </JournalProvider>
            </HabitsProvider>
          </PushNotificationsProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
