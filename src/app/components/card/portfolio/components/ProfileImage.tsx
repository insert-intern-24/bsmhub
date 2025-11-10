import React from 'react';
import Image from 'next/image';
import { convertFromDatabaseImageURL } from '@/utils/supabase/imageHostConverter';

type PresetSize = 'tiny' | 'small' | 'medium' | 'large';
type CustomSize = { width: number; height: number };
type Size = PresetSize | CustomSize;

const sizeMap: Record<PresetSize, { width: number; height: number }> = {
  tiny: { width: 15, height: 15 },
  small: { width: 45, height: 45 },
  medium: { width: 54, height: 54 },
  large: { width: 75, height: 75 },
};

type Variant = 'circle' | 'square' | 'rounded';

const DEFAULT_FALLBACK_PROFILE =
  process.env.NEXT_PUBLIC_PROJECT_FALLBACK_PROFILE ?? '/default-avatar.svg';

interface ProfileImageProps {
  src?: string | null;
  /** 프로필 이름 (alt 텍스트 생성에 사용) */
  name?: string;
  size: Size;
  variant?: Variant;
  className?: string;
}

const getVariantClassName = (variant: Variant): string => {
  switch (variant) {
    case 'circle':
      return 'rounded-full';
    case 'square':
      return 'rounded-none';
    case 'rounded':
      return 'rounded-sm';
    default:
      return 'rounded-full';
  }
};

function ProfileImage({
  src,
  name,
  size,
  variant = 'circle',
  className,
}: ProfileImageProps) {
  const { width, height } = typeof size === 'string' ? sizeMap[size] : size;
  
  const resolvedSrc = src?.trim() || DEFAULT_FALLBACK_PROFILE;

  const imageSrc = resolvedSrc.includes('{{supabaseHost}}')
    ? convertFromDatabaseImageURL(resolvedSrc)
    : resolvedSrc;
  
  const imageAlt = name ? `${name} 프로필` : '프로필 사진';

  const variantClassName = getVariantClassName(variant);

  return (
    <div 
      className={`shrink-0 ${className ?? ''}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <Image
        src={imageSrc}
        alt={imageAlt}
        width={width}
        height={height}
        className={`object-cover ${variantClassName} w-full h-full`}
      />
    </div>
  );
}

export default ProfileImage;
export type { ProfileImageProps, Size, Variant };
export { DEFAULT_FALLBACK_PROFILE };
