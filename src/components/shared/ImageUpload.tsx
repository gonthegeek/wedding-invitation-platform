import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Upload, Loader } from 'lucide-react';

const UploadContainer = styled.div`
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    border-color: #667eea;
    background: #f8f9ff;
  }
  
  &.dragover {
    border-color: #667eea;
    background: #f0f4ff;
  }
`;

const UploadContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const UploadIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
`;

const UploadText = styled.div`
  color: #374151;
  font-size: 1rem;
  font-weight: 500;
`;

const UploadSubtext = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
`;

const PreviewContainer = styled.div`
  position: relative;
  display: inline-block;
  margin-top: 1rem;
`;

const PreviewImage = styled.img`
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: -10px;
  right: -10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #ef4444;
  color: white;
  border: 2px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  font-weight: bold;
  z-index: 10;
  font-size: 20px;
  line-height: 1;
  font-family: Arial, sans-serif;
  
  &:hover {
    background: #dc2626;
    color: white;
    transform: scale(1.1);
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const HiddenInput = styled.input`
  display: none;
`;

interface ImageUploadProps {
  value?: string;
  onChange: (imageUrl: string | null) => void;
  onUpload: (file: File) => Promise<string>;
  label?: string;
  accept?: string;
  maxSize?: number; // in MB
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onUpload,
  label = "Upload Image",
  accept = "image/jpeg,image/jpg,image/png,image/webp",
  maxSize = 5
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    return null;
  };

  const handleFileSelect = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const imageUrl = await onUpload(file);
      onChange(imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    onChange(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      {!value ? (
        <UploadContainer
          className={dragOver ? 'dragover' : ''}
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <UploadContent>
            <UploadIcon>
              {uploading ? <Loader size={24} className="animate-spin" /> : <Upload size={24} />}
            </UploadIcon>
            <UploadText>
              {uploading ? 'Uploading...' : label}
            </UploadText>
            <UploadSubtext>
              Drag and drop or click to browse
              <br />
              Supports: JPEG, PNG, WebP (max {maxSize}MB)
            </UploadSubtext>
          </UploadContent>
        </UploadContainer>
      ) : (
        <PreviewContainer>
          <PreviewImage src={value} alt="Uploaded image" />
          <RemoveButton onClick={handleRemove} type="button">
            ×
          </RemoveButton>
        </PreviewContainer>
      )}
      
      <HiddenInput
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
      />
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  );
};
