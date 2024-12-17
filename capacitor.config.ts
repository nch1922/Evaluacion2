import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'RegisterApp',
  webDir: 'www',
  plugins: {
    Camera: {
      saveToGallery: false,
      allowEditing: false
    }
  }
};



export default config;
