import React from 'react';
import Image from 'next/image';

type Size = 'tiny' | 'small' | 'medium' | 'large';
const sizeMap: Record<Size, number> = {
  tiny: 15,
  small: 45,
  medium: 54,
  large: 75,
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
  const dimension = sizeMap[size];
  const mergedClassName = [
    'relative overflow-hidden rounded-full',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const mergedStyle: React.CSSProperties = {
    width: dimension,
    height: dimension,
    ...style,
  };

  return (
    <div className={mergedClassName} style={mergedStyle}>
      <Image
        src={src}
        alt={`${name ?? '사용자'} 프로필`}
        fill
        sizes={`${dimension}px`}
        className="object-cover"
      />
    </div>
  );
}

export default ProfileImage;
