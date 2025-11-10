import Image from 'next/image';
import { type CSSProperties } from 'react';

type Size = 'tiny' | 'small' | 'medium' | 'large';

const SIZE_MAP: Record<Size, number> = {
  tiny: 15,
  small: 45,
  medium: 54,
  large: 75,
} as const;

interface ProfileImageProps {
  src: string;
  name?: string;
  size: Size;
  className?: string;
  style?: CSSProperties;
}

const ProfileImage = ({
  src,
  name,
  size,
  className = '',
  style,
}: ProfileImageProps) => {
  const dimension = SIZE_MAP[size];

  return (
    <div
      className={`relative overflow-hidden rounded-full ${className}`.trim()}
      style={{ width: dimension, height: dimension, ...style }}
    >
      <Image
        src={src}
        alt={`${name ?? '사용자'} 프로필`}
        fill
        sizes={`${dimension}px`}
        className="object-cover"
      />
    </div>
  );
};

export default ProfileImage;
