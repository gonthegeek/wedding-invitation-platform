import React, { createContext, useEffect, useState } from 'react';
import { 
  type User as FirebaseUser, 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import type { User, UserRole } from '../types';

interface AuthContextType {
  currentUser: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: UserRole, displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const createUserDocument = async (firebaseUser: FirebaseUser, role: UserRole, displayName?: string) => {
    try {
      const userDoc = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        role,
        displayName: displayName || firebaseUser.displayName || '',
        photoURL: firebaseUser.photoURL || '',
        createdAt: new Date(),
        lastLoginAt: new Date(),
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userDoc);
      console.log('User document created in Firestore:', userDoc);
      return userDoc;
    } catch (error) {
      console.error('Error creating user document:', error);
      throw new Error('Failed to create user profile');
    }
  };

  const getUserDocument = async (uid: string): Promise<User | null> => {
    try {
      console.log('Fetching user document for UID:', uid);
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('User document found:', userData);
        return {
          ...userData,
          createdAt: userData.createdAt?.toDate() || new Date(),
          lastLoginAt: userData.lastLoginAt?.toDate() || new Date(),
        } as User;
      }
      
      console.log('User document not found for UID:', uid);
      return null;
    } catch (error) {
      console.error('Error fetching user document:', error);
      return null;
    }
  };

  const updateLastLogin = async (uid: string) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      // Check if document exists first
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        await updateDoc(userDocRef, {
          lastLoginAt: new Date(),
        });
      } else {
        console.warn('User document not found for lastLogin update:', uid);
        // Document doesn't exist, this might be expected during registration
      }
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setFirebaseUser(firebaseUser);
        let userDoc = await getUserDocument(firebaseUser.uid);
        
        // If user document doesn't exist, it might be a new registration
        // Wait a moment and try again, or create a basic document
        if (!userDoc) {
          console.log('User document not found, waiting for creation...');
          // Wait a short time for the registration process to complete
          setTimeout(async () => {
            userDoc = await getUserDocument(firebaseUser.uid);
            if (userDoc) {
              setCurrentUser(userDoc);
              await updateLastLogin(firebaseUser.uid);
            } else {
              console.warn('User document still not found after registration');
              setCurrentUser(null);
            }
            setLoading(false);
          }, 1000);
        } else {
          setCurrentUser(userDoc);
          await updateLastLogin(firebaseUser.uid);
          setLoading(false);
        }
      } else {
        setFirebaseUser(null);
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, role: UserRole, displayName?: string) => {
    try {
      setLoading(true);
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      if (displayName) {
        await updateProfile(user, { displayName });
      }
      
      // Create the user document
      const userDoc = await createUserDocument(user, role, displayName);
      console.log('User document created successfully:', userDoc);
      
      // Set the current user immediately after creation
      setCurrentUser(userDoc);
      
      // Wait a moment to ensure Firestore has processed the write
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!currentUser) throw new Error('No user logged in');
    
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        ...updates,
        updatedAt: new Date(),
      });
      
      // Update local state
      setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    firebaseUser,
    loading,
    login,
    register,
    logout,
    resetPassword,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
