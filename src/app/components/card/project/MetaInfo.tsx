import React from 'react';
import Image from 'next/image';
import { Caption, Label } from '../../system/text';

interface MetaInfoProps {
  title: string;
  authors: {
    name: string;
    profileImage: string;
  }[];
}

const MetaInfo = ({ title, authors }: MetaInfoProps) => {
  return (
    <figcaption className="flex justify-between">
      <Label className="text-gray-base">{title}</Label>
      <div className="flex items-center gap-1">
        {authors.length === 1 ? (
          // 작성자가 1명인 경우: 프로필 사진 + 이름
          <>
            <Image
              src={authors[0].profileImage}
              alt={`${authors[0].name} 프로필 이미지`}
              width={(20 * 12) / 16}
              height={(20 * 12) / 16}
              className="rounded-full"
            />
            <Caption>{authors[0].name}</Caption>
          </>
        ) : (
          // 작성자가 여러명인 경우: 프로필 사진만 나열
          <div className="flex items-center -space-x-1">
            {authors.map((author, index) => (
              <Image
                key={index}
                src={author.profileImage}
                alt={`${author.name} 프로필 이미지`}
                width={(20 * 12) / 16}
                height={(20 * 12) / 16}
                className="rounded-full"
                style={{ zIndex: authors.length - index }}
              />
            ))}
          </div>
        )}
      </div>
    </figcaption>
  );
};

export default MetaInfo;
