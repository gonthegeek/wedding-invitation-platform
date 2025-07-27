import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';
import type { Wedding } from '../types';

export class WeddingService {
  private static COLLECTION = 'weddings';

  // Create a new wedding
  static async createWedding(coupleId: string, weddingData: Partial<Wedding>): Promise<string> {
    try {
      const newWedding = {
        ...weddingData,
        coupleId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: true,
      };

      const docRef = await addDoc(collection(db, this.COLLECTION), newWedding);
      console.log('Wedding created with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creating wedding:', error);
      throw new Error('Failed to create wedding');
    }
  }

  // Get wedding by ID
  static async getWedding(weddingId: string): Promise<Wedding | null> {
    try {
      const weddingDoc = await getDoc(doc(db, this.COLLECTION, weddingId));
      
      if (weddingDoc.exists()) {
        const data = weddingDoc.data();
        
        // Helper function to safely convert dates
        const safeToDate = (dateField: unknown): Date => {
          if (!dateField) return new Date();
          if (dateField instanceof Date) return dateField;
          
          // Check if it's a Firestore Timestamp
          if (typeof dateField === 'object' && dateField !== null && 'toDate' in dateField) {
            const timestamp = dateField as { toDate: () => Date };
            if (typeof timestamp.toDate === 'function') {
              return timestamp.toDate();
            }
          }
          
          if (typeof dateField === 'string') return new Date(dateField);
          return new Date();
        };
        
        return {
          id: weddingDoc.id,
          ...data,
          weddingDate: safeToDate(data.weddingDate),
          createdAt: safeToDate(data.createdAt),
          updatedAt: safeToDate(data.updatedAt),
          settings: data.settings ? {
            ...data.settings,
            requireRSVPDeadline: safeToDate(data.settings.requireRSVPDeadline),
          } : data.settings,
        } as Wedding;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching wedding:', error);
      throw new Error('Failed to fetch wedding');
    }
  }

  // Get wedding by couple ID
  static async getWeddingByCouple(coupleId: string): Promise<Wedding | null> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        where('coupleId', '==', coupleId),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();
        
        // Helper function to safely convert dates
        const safeToDate = (dateField: unknown): Date => {
          if (!dateField) return new Date();
          if (dateField instanceof Date) return dateField;
          
          // Check if it's a Firestore Timestamp
          if (typeof dateField === 'object' && dateField !== null && 'toDate' in dateField) {
            const timestamp = dateField as { toDate: () => Date };
            if (typeof timestamp.toDate === 'function') {
              return timestamp.toDate();
            }
          }
          
          if (typeof dateField === 'string') return new Date(dateField);
          return new Date();
        };
        
        return {
          id: doc.id,
          ...data,
          weddingDate: safeToDate(data.weddingDate),
          createdAt: safeToDate(data.createdAt),
          updatedAt: safeToDate(data.updatedAt),
          settings: data.settings ? {
            ...data.settings,
            requireRSVPDeadline: safeToDate(data.settings.requireRSVPDeadline),
          } : data.settings,
        } as Wedding;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching wedding by couple:', error);
      throw new Error('Failed to fetch wedding');
    }
  }

  // Get all weddings (for admin)
  static async getAllWeddings(): Promise<Wedding[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const weddings: Wedding[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        weddings.push({
          id: doc.id,
          ...data,
          weddingDate: data.weddingDate?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Wedding);
      });
      
      return weddings;
    } catch (error) {
      console.error('Error fetching all weddings:', error);
      throw new Error('Failed to fetch weddings');
    }
  }

  // Update wedding
  static async updateWedding(weddingId: string, updates: Partial<Wedding>): Promise<void> {
    try {
      const weddingRef = doc(db, this.COLLECTION, weddingId);
      await updateDoc(weddingRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      console.log('Wedding updated successfully');
    } catch (error) {
      console.error('Error updating wedding:', error);
      throw new Error('Failed to update wedding');
    }
  }

  // Delete wedding (soft delete)
  static async deleteWedding(weddingId: string): Promise<void> {
    try {
      const weddingRef = doc(db, this.COLLECTION, weddingId);
      await updateDoc(weddingRef, {
        isActive: false,
        updatedAt: serverTimestamp(),
      });
      console.log('Wedding deleted successfully');
    } catch (error) {
      console.error('Error deleting wedding:', error);
      throw new Error('Failed to delete wedding');
    }
  }

  // Upload wedding image
  static async uploadWeddingImage(weddingId: string, file: File, imagePath: string): Promise<string> {
    try {
      const storageRef = ref(storage, `weddings/${weddingId}/${imagePath}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('Image uploaded successfully:', downloadURL);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  }

  // Delete wedding image
  static async deleteWeddingImage(imagePath: string): Promise<void> {
    try {
      const storageRef = ref(storage, imagePath);
      await deleteObject(storageRef);
      console.log('Image deleted successfully');
    } catch (error) {
      console.error('Error deleting image:', error);
      throw new Error('Failed to delete image');
    }
  }

  // Generate unique subdomain
  static async generateSubdomain(brideFirstName: string, groomFirstName: string): Promise<string> {
    const baseSubdomain = `${brideFirstName.toLowerCase()}-${groomFirstName.toLowerCase()}`;
    let subdomain = baseSubdomain;
    let counter = 1;

    // Check if subdomain exists
    while (await this.subdomainExists(subdomain)) {
      subdomain = `${baseSubdomain}-${counter}`;
      counter++;
    }

    return subdomain;
  }

  // Check if subdomain exists
  private static async subdomainExists(subdomain: string): Promise<boolean> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        where('subdomain', '==', subdomain),
        where('isActive', '==', true)
      );
      
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking subdomain:', error);
      return false;
    }
  }

  // Calculate days until wedding
  static getDaysUntilWedding(weddingDate: Date): number {
    const today = new Date();
    const timeDifference = weddingDate.getTime() - today.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
    return Math.max(0, daysDifference);
  }

  // Validate wedding data
  static validateWeddingData(weddingData: Partial<Wedding>): string[] {
    const errors: string[] = [];

    if (!weddingData.brideFirstName?.trim()) {
      errors.push('Bride first name is required');
    }
    if (!weddingData.groomFirstName?.trim()) {
      errors.push('Groom first name is required');
    }
    if (!weddingData.weddingDate) {
      errors.push('Wedding date is required');
    } else if (new Date(weddingData.weddingDate) < new Date()) {
      errors.push('Wedding date must be in the future');
    }
    if (!weddingData.ceremonyLocation?.name?.trim()) {
      errors.push('Ceremony location is required');
    }
    if (!weddingData.receptionLocation?.name?.trim()) {
      errors.push('Reception location is required');
    }

    return errors;
  }
}
