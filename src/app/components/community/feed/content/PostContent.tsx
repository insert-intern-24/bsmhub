import React from 'react';
import Image from 'next/image';

interface PostContentProps {
  profileImage: string;
  projectName: string;
  projectDescription: string;
  contentImages: string[];
}

export default function PostContent({
  profileImage,
  projectName,
  projectDescription,
  contentImages,
}: PostContentProps) {
  return (
    <>
      <div className="flex p-4 flex-col justify-center items-start gap-4 self-stretch rounded-lg bg-customGray">
        <div className="flex items-center gap-[0.375rem]">
          <Image
            src={profileImage}
            alt="Profile Image"
            width={(24 / 16) * 12}
            height={(24 / 16) * 12}
          />
          <span className="text-black text-base font-bold leading-none">
            {projectName}
          </span>
          <span className="text-descriptionColor text-base font-normal leading-none">
            {projectDescription}
          </span>
        </div>
        <div className="flex items-start gap-4">
          {contentImages.map((image, index) => (
            <Image
              key={index}
              src={image}
              alt={`Content Image ${index + 1}`}
              width={(416 / 16) * 12}
              height={(234 / 16) * 12}
            />
          ))}
        </div>
      </div>
    </>
  );
}
