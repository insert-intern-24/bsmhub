import React from 'react';
import { Caption, Label } from '../../system/text';
import ProfileImage from '../portfolio/components/ProfileImage';

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
            <ProfileImage
              src={authors[0].profileImage}
              name={authors[0].name}
              size="tiny"
            />
            <Caption>{authors[0].name}</Caption>
          </>
        ) : (
          // 작성자가 여러명인 경우: 프로필 사진만 나열
          <div className="flex items-center -space-x-1">
            {authors.map((author, index) => (
              <ProfileImage
                key={index}
                src={author.profileImage}
                name={author.name}
                size="tiny"
                className=""
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
