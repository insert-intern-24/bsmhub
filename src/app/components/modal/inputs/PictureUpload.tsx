'use client';

import { useRef, useState, useEffect } from 'react';

interface PictureUploadProps {
  aspectRatio?: string; // "1:1", "3:4", "16:9" 등 자유롭게 입력 가능
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any; // React Hook Form의 value (boolean, array 등 다양한 타입이 올 수 있음)
  onFileChange?: (file: File | null) => void; // 파일 변경 콜백
}

function PictureUpload({ aspectRatio = '1:1', value, onFileChange }: PictureUploadProps) {
  const [preview, setPreview] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);

  // value prop이 변경되면 preview 업데이트
  useEffect(() => {
    if (value && typeof value === 'string') {
      setPreview(value);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      onFileChange?.(null);
      return;
    }
    
    if (preview) URL.revokeObjectURL(preview);
    const url = URL.createObjectURL(file);
    setPreview(url);
    onFileChange?.(file);
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
        // eslint-disable-next-line @next/next/no-img-element
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
