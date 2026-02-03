import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.umbral.app',
  appName: 'Umbral',
  webDir: 'out',
  server: {
    url: 'https://umbrales-five.vercel.app/', // You will replace this later
    cleartext: true,
  },
};

export default config;
