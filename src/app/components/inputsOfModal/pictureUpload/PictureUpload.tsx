import React from 'react';

function PictureUpload() {
  return (
    <div className="inline-block h-[5.875rem]">
      <div className="h-full aspect-square">
        <input
          className="w-full h-full py-1 px-2.5 flex justify-center items-center gap-2.5 rounded-md bg-light-gray-outline text-gray-base text-base font-normal leading-6 tracking-[0.0057rem]"
          placeholder="사진 업로드"
          type="file"
        />
      </div>
    </div>
  );
}

export default PictureUpload;
