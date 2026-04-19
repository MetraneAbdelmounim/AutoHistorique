import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.autohistorique.app',
  appName: 'AutoHistorique',
  webDir: 'dist/autohistorique-frontend',

  ios: {
    contentInset: 'always',
    scheme: 'AutoHistorique',
    backgroundColor: '#F7F8FA',
    limitsNavigationsToAppBoundDomains: false,
  },

  android: {
    backgroundColor: '#F7F8FA',
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      backgroundColor: '#0A0E1A',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
      useDialog: false,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#EC6F3B',
      overlaysWebView: false,
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
  },
};

export default config;
