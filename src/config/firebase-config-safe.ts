// Alternative Firebase config that uses window object for production
const getFirebaseConfig = () => {
  // Check if we're in production and have config in window object
  if (typeof window !== 'undefined' && (window as any).FIREBASE_CONFIG) {
    return (window as any).FIREBASE_CONFIG;
  }
  
  // Otherwise use environment variables (development)
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  };
};

export const firebaseConfig = getFirebaseConfig();
