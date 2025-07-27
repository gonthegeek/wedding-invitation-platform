import React, { useState } from 'react';
import styled from 'styled-components';
import { X, Plus } from 'lucide-react';

const GalleryContainer = styled.div`
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 1.5rem;
  min-height: 200px;
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ImageItem = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #e5e7eb;
`;

const GalleryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    background: rgba(220, 38, 38, 0.9);
  }
`;

const AddButton = styled.button`
  aspect-ratio: 1;
  border: 2px dashed #9ca3af;
  border-radius: 8px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #667eea;
    color: #667eea;
    background: #f8f9ff;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const UploadInfo = styled.div`
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 1rem;
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

interface GalleryUploadProps {
  value: string[];
  onChange: (images: string[]) => void;
  onUpload: (file: File) => Promise<string>;
  maxImages?: number;
  maxSize?: number; // in MB
}

export const GalleryUpload: React.FC<GalleryUploadProps> = ({
  value = [],
  onChange,
  onUpload,
  maxImages = 10,
  maxSize = 5
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return 'Please upload a JPEG, PNG, or WebP image.';
    }

    // Check file size
    const maxBytes = maxSize * 1024 * 1024;
    if (file.size > maxBytes) {
      return `File size must be less than ${maxSize}MB.`;
    }

    // Check max images
    if (value.length >= maxImages) {
      return `Maximum ${maxImages} images allowed.`;
    }

    return null;
  };

  const handleFileSelect = async (files: FileList) => {
    setError(null);
    
    const remainingSlots = maxImages - value.length;
    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    
    if (filesToUpload.length === 0) {
      setError(`Maximum ${maxImages} images allowed.`);
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = filesToUpload.map(async (file) => {
        const validationError = validateFile(file);
        if (validationError) {
          throw new Error(validationError);
        }
        return await onUpload(file);
      });

      const newImageUrls = await Promise.all(uploadPromises);
      onChange([...value, ...newImageUrls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleRemove = (indexToRemove: number) => {
    const newImages = value.filter((_, index) => index !== indexToRemove);
    onChange(newImages);
  };

  const canAddMore = value.length < maxImages && !uploading;

  return (
    <div>
      <GalleryContainer>
        <GalleryGrid>
          {value.map((imageUrl, index) => (
            <ImageItem key={index}>
              <GalleryImage src={imageUrl} alt={`Gallery image ${index + 1}`} />
              <RemoveButton onClick={() => handleRemove(index)} type="button">
                <X size={12} />
              </RemoveButton>
            </ImageItem>
          ))}
          
          {canAddMore && (
            <AddButton
              onClick={() => document.getElementById('gallery-input')?.click()}
              type="button"
            >
              <Plus size={24} />
            </AddButton>
          )}
        </GalleryGrid>
        
        <UploadInfo>
          {uploading 
            ? 'Uploading images...' 
            : `${value.length}/${maxImages} images • JPEG, PNG, WebP (max ${maxSize}MB each)`
          }
        </UploadInfo>
      </GalleryContainer>
      
      <HiddenInput
        id="gallery-input"
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        multiple
        onChange={handleInputChange}
      />
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  );
};
