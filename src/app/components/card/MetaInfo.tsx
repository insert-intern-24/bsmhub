import React from 'react';
import Image from 'next/image';
import { Caption, Label } from '../system/text';

interface MetaInfoProps {
  title: string;
  author: {
    name: string;
    profileImage: string;
  };
}

const MetaInfo = ({ title, author }: MetaInfoProps) => {
  return (
    <figcaption className="flex justify-between">
      <Label className="text-gray-base">{title}</Label>
      <div className="flex justify-between items-center gap-1">
        <Image
          src={author.profileImage}
          alt={`${author.name} 프로필 이미지`}
          width={(20 * 12) / 16}
          height={(20 * 12) / 16}
        />
        <Caption>{author.name}</Caption>
      </div>
    </figcaption>
  );
};

export default MetaInfo;
