import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { convertFromDatabaseImageURL } from '@/services/supabase/imageHostConverter';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/app/components/tiptap/tiptap-ui-primitive/tooltip/tooltip';

type PresetSize = 'tiny' | 'small' | 'medium' | 'large';
type CustomSize = { width: number; height: number };
type Size = PresetSize | CustomSize;

const sizeMap: Record<PresetSize, { width: number; height: number }> = {
  tiny: { width: 15, height: 15 },
  small: { width: 45, height: 45 },
  medium: { width: 54, height: 54 },
  large: { width: 75, height: 75 },
};

type Shape = 'circle' | 'square' | 'rounded';

const DEFAULT_FALLBACK_PROFILE =
  process.env.NEXT_PUBLIC_PROJECT_FALLBACK_PROFILE ?? '/default-avatar.svg';

interface ProfileImageProps {
  src?: string | null;
  /** 프로필 이름 (alt 텍스트 및 툴팁에 사용) */
  name?: string;
  size: Size;
  shape?: Shape;
  className?: string;
  /** true일 경우 name을 통해 Link 생성 */
  canRedirect?: boolean;
  /** true일 경우 호버 시 툴팁 표시 */
  showTooltip?: boolean;
}

const getShapeClassName = (shape: Shape): string => {
  switch (shape) {
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
  shape = 'circle',
  className,
  canRedirect,
  showTooltip = false,
}: ProfileImageProps) {
  const { width, height } = typeof size === 'string' ? sizeMap[size] : size;

  const resolvedSrc = src?.trim() || DEFAULT_FALLBACK_PROFILE;

  const imageSrc = resolvedSrc.includes('{{supabaseHost}}')
    ? convertFromDatabaseImageURL(resolvedSrc)
    : resolvedSrc;

  const imageAlt = name ? `${name} 프로필` : '프로필 사진';
  const shapeClassName = getShapeClassName(shape);

  const image = (
    <div
      className={`shrink-0 ${className ?? ''}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <Image
        src={imageSrc}
        alt={imageAlt}
        width={width}
        height={height}
        className={`object-cover ${shapeClassName} w-full h-full`}
      />
    </div>
  );

  const imageWithLink = canRedirect && name ? (
    <Link href={`/portfolio/${encodeURIComponent(name)}`}>{image}</Link>
  ) : (
    image
  );

  if (showTooltip && name) {
    return (
      <Tooltip placement="top" delay={0}>
        <TooltipTrigger asChild>{imageWithLink}</TooltipTrigger>
        <TooltipContent>{name}</TooltipContent>
      </Tooltip>
    );
  }

  return imageWithLink;
}

export default ProfileImage;
export type { ProfileImageProps, Size, Shape };
export { DEFAULT_FALLBACK_PROFILE };
