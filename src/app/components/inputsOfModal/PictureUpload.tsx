'use client';

import React, { useRef, useState, useEffect } from 'react';

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
        className="h-full overflow-hidden input-common aspect-1 flex items-center justify-center"
        onClick={handleClick}
      >
        {imagePreview ? (
          <div className="w-full h-full">
            <img
              src={imagePreview}
              alt="업로드된 이미지"
              className="object-cover w-full h-full"
            />
          </div>
        ) : (
          <span className="text-gray-500 text-body">사진 업로드</span>
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
