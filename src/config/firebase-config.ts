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
    // Replace these with your actual production Firebase config
    apiKey: "AIza...", // Your actual API key
    authDomain: "wedding-invitation-platform.firebaseapp.com",
    projectId: "wedding-invitation-platform",
    storageBucket: "wedding-invitation-platform.appspot.com",
    messagingSenderId: "123456789", // Your actual sender ID
    appId: "1:123456789:web:abcdef", // Your actual app ID
    measurementId: "G-ABCDEFGHIJ" // Your actual measurement ID
  }
};

// Get the current environment
const environment = import.meta.env.VITE_NODE_ENV || 'development';

// Export the appropriate config
export const firebaseConfig = firebaseConfigs[environment as keyof typeof firebaseConfigs] || firebaseConfigs.development;
