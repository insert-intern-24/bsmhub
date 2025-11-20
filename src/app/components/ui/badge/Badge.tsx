import React from 'react';
import Image from 'next/image';

interface BadgeProps {
  className?: string;
  size?: number;
  alt?: string;
}

const Badge = ({ className = '', alt = 'Badge' }: BadgeProps) => {
  return (
    <Image
      src="/card/badge.png"
      alt={alt}
      width={(46 * 12) / 16}
      height={(36 * 12) / 16}
      className={className}
    />
  );
};

export default Badge;
