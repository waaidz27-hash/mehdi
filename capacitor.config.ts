import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.akademia.app',
  appName: 'أكاديمية المعرفة',
  webDir: 'dist',
  android: {
    backgroundColor: '#0a0e1a',
  },
  server: {
    androidScheme: 'https',
  },
};

export default config;
