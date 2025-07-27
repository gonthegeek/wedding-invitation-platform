import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  listAll 
} from 'firebase/storage';
import { storage } from './firebase';

export class StorageService {
  // Upload image to Firebase Storage
  static async uploadImage(file: File, path: string): Promise<string> {
    try {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Please upload a JPEG, PNG, or WebP image.');
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('File size must be less than 5MB.');
      }

      // Create unique filename
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2);
      const extension = file.name.split('.').pop();
      const fileName = `${timestamp}_${randomId}.${extension}`;
      
      // Create storage reference
      const storageRef = ref(storage, `${path}/${fileName}`);
      
      console.log('Uploading image to:', `${path}/${fileName}`);
      
      // Upload file
      const snapshot = await uploadBytes(storageRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      console.log('Image uploaded successfully:', downloadURL);
      return downloadURL;
      
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  // Upload couple photos
  static async uploadCouplePhoto(weddingId: string, file: File, type: 'bride' | 'groom' | 'couple'): Promise<string> {
    const path = `weddings/${weddingId}/photos/${type}`;
    return this.uploadImage(file, path);
  }

  // Upload wedding party photos
  static async uploadWeddingPartyPhoto(weddingId: string, file: File, memberId: string): Promise<string> {
    const path = `weddings/${weddingId}/wedding-party/${memberId}`;
    return this.uploadImage(file, path);
  }

  // Upload gallery photos
  static async uploadGalleryPhoto(weddingId: string, file: File): Promise<string> {
    const path = `weddings/${weddingId}/gallery`;
    return this.uploadImage(file, path);
  }

  // Delete image from Firebase Storage
  static async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Extract the path from the URL
      const url = new URL(imageUrl);
      const pathMatch = url.pathname.match(/\/o\/(.+)\?/);
      
      if (!pathMatch) {
        throw new Error('Invalid image URL format');
      }
      
      const imagePath = decodeURIComponent(pathMatch[1]);
      const imageRef = ref(storage, imagePath);
      
      await deleteObject(imageRef);
      console.log('Image deleted successfully:', imagePath);
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }

  // Get all gallery images for a wedding
  static async getGalleryImages(weddingId: string): Promise<string[]> {
    try {
      const galleryRef = ref(storage, `weddings/${weddingId}/gallery`);
      const result = await listAll(galleryRef);
      
      const urls = await Promise.all(
        result.items.map(item => getDownloadURL(item))
      );
      
      return urls;
    } catch (error) {
      console.error('Error getting gallery images:', error);
      return [];
    }
  }

  // Compress image before upload
  static compressImage(file: File, maxWidth: number = 1200, quality: number = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Canvas to Blob conversion failed'));
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = () => reject(new Error('Image loading failed'));
      img.src = URL.createObjectURL(file);
    });
  }
}
