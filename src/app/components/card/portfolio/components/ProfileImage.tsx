import React from 'react';
import Image from 'next/image';

interface ProfileImageProps {
  src: string;
  name: string;
  size: 'small' | 'medium' | 'large';
  className?: string;
}

const sizeMap = {
  small: 'w-[3.75rem] h-[3.75rem]',
  medium: 'w-[4.5rem] h-[4.5rem]', 
  large: 'w-[6.25rem] h-[6.25rem]',
};

const ProfileImage = ({ src, name, size, className = '' }: ProfileImageProps) => {
  return (
    <div className={`relative ${sizeMap[size]} ${className}`}>
      <Image
        src={src}
        alt={`${name} 프로필`}
        fill
        className="rounded-full object-cover"
      />
    </div>
  );
};

export default ProfileImage;