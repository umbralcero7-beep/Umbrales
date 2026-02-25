import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.umbral.app',
  appName: 'Umbral',
  webDir: '.next',
  server: {
    url: 'https://umbrales-five.vercel.app/',
    cleartext: true,
  },
};

export default config;
