import React from 'react';
import { Caption, Label } from '../../system/text';
import ProfileImage from '../portfolio/components/ProfileImage';

interface MetaInfoProps {
  title?: string;
  description: string;
  ownerName: string;
  ownerProfileImage?: string;
  authors: {
    name?: string;
    profileImage: string;
  }[];
}

const MetaInfo = ({
  title,
  description,
  ownerName,
  ownerProfileImage,
  authors,
}: MetaInfoProps) => {
  // 프로젝트명 - 설명 형식으로 조합
  const fullDescription = title
    ? `${title} - ${description}`
    : description;

  return (
    <figcaption className="flex-x-center gap-4">
      <Label className="text-gray-base truncate">{fullDescription}</Label>
      <div className="flex-y-center gap-1 shrink-0">
        {authors.length === 0 ? (
          // 기여자가 없을 때: 오너 프로필 이미지 + 이름
          <>
            {ownerProfileImage && (
              <ProfileImage
                src={ownerProfileImage}
                name={ownerName}
                size="tiny"
              />
            )}
            <Caption className="font-black">{ownerName}</Caption>
          </>
        ) : authors.length === 1 ? (
          // 기여자가 1명일 때: 프로필 사진 + 이름
          <>
            <ProfileImage
              src={authors[0].profileImage}
              name={authors[0].name ?? ''}
              size="tiny"
            />
            <Caption className="font-black">{authors[0].name}</Caption>
          </>
        ) : (
          // 기여자가 여러명일 때: 프로필 사진만 나열
          <div className="flex-y-center -space-x-1">
            {authors.map((author, index) => (
              <ProfileImage
                key={index}
                src={author.profileImage}
                name={author.name}
                size="tiny"
                className={`z-[${authors.length - index}]`}
              />
            ))}
          </div>
        )}
      </div>
    </figcaption>
  );
};

export default MetaInfo;
