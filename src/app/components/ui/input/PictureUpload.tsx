'use client';

import { useRef, useState } from 'react';

interface PictureUploadProps {
  aspectRatio?: string;
  onFileChange?: (file: File | null) => void;
  existingImageUrl?: string;
}

const PictureUpload = ({ aspectRatio = '1:1', onFileChange, existingImageUrl }: PictureUploadProps) => {
  const [preview, setPreview] = useState<string>();
  const imageUrl = preview || existingImageUrl;
  const [w, h] = aspectRatio.split(':').map(Number);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return onFileChange?.(null);
    
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
    onFileChange?.(file);
  };

  return (
    <label 
      className="group relative overflow-hidden input-common flex-col !justify-center cursor-pointer"
      style={{ height: '5.875rem', width: `${(5.875 * w) / h}rem` }}
    >
      {imageUrl && (
        <div 
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-400 group-hover:opacity-0"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      )}
      <span className={`text-gray-500 text-body z-10 relative ${imageUrl ? 'opacity-0 group-hover:opacity-100' : ''} transition-opacity duration-400`}>
        사진 업로드
      </span>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </label>
  );
};

export default PictureUpload;
