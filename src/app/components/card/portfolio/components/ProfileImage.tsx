import React from 'react';
import Image from 'next/image';
import { convertFromDatabaseImageURL } from '@/utils/supabase/imageHostConverter';

type Size = 'tiny' | 'small' | 'medium' | 'large';
const sizeMap: Record<Size, { width: number; height: number }> = {
  tiny: { width: 15, height: 15 },
  small: { width: 45, height: 45 },
  medium: { width: 54, height: 54 },
  large: { width: 75, height: 75 },
};
interface ProfileImageProps {
  src: string;
  name?: string;
  size: Size;
  className?: string;
  style?: React.CSSProperties;
}

function ProfileImage({
  src,
  name,
  size,
  className,
  style,
}: ProfileImageProps) {
  const imageUrl = convertFromDatabaseImageURL(src);
  return (
    <div className={className ?? 'min-w-fit'} style={style}>
      <Image
        src={imageUrl}
        alt={`${name} 프로필`}
        {...sizeMap[size]}
        className="object-cover rounded-full"
      />
    </div>
  );
}

export default ProfileImage;
