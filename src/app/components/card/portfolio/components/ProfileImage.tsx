import React from 'react';
import Image from 'next/image';

type Size = 'tiny' | 'small' | 'medium' | 'large';

const sizeMap: Record<Size, string> = {
  tiny: 'w-[0.9375rem] h-[0.9375rem]', // 15px
  small: 'w-[3.75rem] h-[3.75rem]',
  medium: 'w-[4.5rem] h-[4.5rem]',
  large: 'w-[6.25rem] h-[6.25rem]',
};

interface ProfileImageProps {
  src: string;
  name: string;
  size: Size;
  className?: string;
  style?: React.CSSProperties;
}

function ProfileImage({ src, name, size, className, style }: ProfileImageProps) {
  return (
    <div 
      className={`relative ${sizeMap[size]} rounded-full overflow-hidden ${className ?? ''}`}
      style={style}
    >
      <Image
        src={src}
        alt={`${name} 프로필`}
        fill
        className="object-cover"
      />
    </div>
  );
}

export default ProfileImage;