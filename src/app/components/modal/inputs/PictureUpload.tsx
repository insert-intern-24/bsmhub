'use client';

import { useRef, useState } from 'react';

interface PictureUploadProps {
  aspectRatio?: string; // "1:1", "3:4", "16:9" 등 자유롭게 입력 가능
}

function PictureUpload({ aspectRatio = '1:1' }: PictureUploadProps) {
  const [preview, setPreview] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
  };

  const getWidth = (ratio: string) => {
    const [w, h] = ratio.split(':').map(Number);
    const height = 5.875; // rem
    return `${(height * w) / h}rem`;
  };

  return (
    <label 
      className="overflow-hidden input-common flex-col !justify-center cursor-pointer"
      style={{ height: '5.875rem', width: getWidth(aspectRatio) }}
    >
      {preview ? (
        <img src={preview} alt="업로드된 이미지" className="object-cover w-full h-full" />
      ) : (
        <span className="text-gray-500 text-body">사진 업로드</span>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </label>
  );
}

export default PictureUpload;
