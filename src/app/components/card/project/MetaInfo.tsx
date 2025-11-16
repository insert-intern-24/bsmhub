import React from 'react';
import { Caption, Label } from '../../system/text';
import ProfileImage from '../portfolio/components/ProfileImage';

interface MetaInfoProps {
  title?: string;
  description: string;
  ownerProfileImage?: string;
  authors: {
    name?: string;
    profileImage: string;
  }[];
}

const MetaInfo = ({
  title,
  description,
  ownerProfileImage,
  authors,
}: MetaInfoProps) => {
  // 프로젝트명 - 설명 형식으로 조합
  const fullDescription = title
    ? `${title} - ${description}`
    : description;

  // 기여자가 없을 경우 프로젝트 오너의 프로필 이미지를 기본으로 사용
  const displayAuthors =
    authors.length > 0
      ? authors
      : ownerProfileImage
        ? [{ name: undefined, profileImage: ownerProfileImage }]
        : [];

  return (
    <figcaption className="flex-x-center gap-4">
      <Label className="text-gray-base truncate">{fullDescription}</Label>
      <div className="flex-y-center gap-1 shrink-0">
        {displayAuthors.length === 1 ? (
          // 작성자가 1명인 경우: 프로필 사진 + 이름 (이름이 있을 때만)
          <>
            <ProfileImage
              src={displayAuthors[0].profileImage}
              name={displayAuthors[0].name ?? ''}
              size="tiny"
            />
            {displayAuthors[0].name && (
              <Caption className="font-black">{displayAuthors[0].name}</Caption>
            )}
          </>
        ) : displayAuthors.length > 1 ? (
          // 작성자가 여러명인 경우: 프로필 사진만 나열
          <div className="flex-y-center -space-x-1">
            {displayAuthors.map((author, index) => (
              <ProfileImage
                key={index}
                src={author.profileImage}
                name={author.name}
                size="tiny"
                className={`z-[${displayAuthors.length - index}]`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </figcaption>
  );
};

export default MetaInfo;
