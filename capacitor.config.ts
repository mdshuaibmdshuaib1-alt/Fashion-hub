import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.luxestyle.app',
  appName: 'LuxeStyle',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
