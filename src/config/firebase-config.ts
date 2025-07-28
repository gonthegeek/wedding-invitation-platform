// Firebase configuration for different environments
const firebaseConfigs = {
  development: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  },
  production: {
    apiKey: "your_firebase_api_key",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "your_messaging_sender_id",
    appId: "your_firebase_app_id",
    measurementId: "your_measurement_id"
  }
};

// Get the current environment
const environment = import.meta.env.VITE_NODE_ENV || 'development';

// Export the appropriate config
export const firebaseConfig = firebaseConfigs[environment as keyof typeof firebaseConfigs] || firebaseConfigs.development;
