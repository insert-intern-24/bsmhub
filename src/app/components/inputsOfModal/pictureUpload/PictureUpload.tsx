'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';

function PictureUpload() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const imageUrl = URL.createObjectURL(files[0]);
      setImagePreview(imageUrl);
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <div className="inline-block h-[5.875rem]">
      <div
        className="h-full aspect-1 flex flex-col items-center justify-center rounded-md bg-light-gray-outline cursor-pointer overflow-hidden relative"
        onClick={handleClick}
      >
        {imagePreview ? (
          <div className="relative w-full h-full">
            <Image
              src={imagePreview}
              alt="업로드된 이미지"
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <span className="text-gray-500 text-sm font-normal">사진 업로드</span>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}

export default PictureUpload;
