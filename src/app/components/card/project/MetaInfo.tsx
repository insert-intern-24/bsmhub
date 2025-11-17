import React from 'react';
import ProfileImage from '../portfolio/components/ProfileImage';
import { Caption, Label } from '../../system/text';

interface MetaInfoProps {
  title?: string;
  description: string;
  ownerName: string;
  ownerProfileImage?: string;
  authors: { name?: string; profileImage: string }[];
}

const MetaInfo = ({ title, description, ownerName, ownerProfileImage, authors }: MetaInfoProps) => {
  const renderAuthor = () => {
    if (authors.length === 0) {
      return (
        <>
          {ownerProfileImage && <ProfileImage src={ownerProfileImage} name={ownerName} size="tiny" />}
          <Caption className="font-black">{ownerName}</Caption>
        </>
      );
    }
    if (authors.length === 1) {
      return (
        <>
          <ProfileImage src={authors[0].profileImage} name={authors[0].name ?? ''} size="tiny" />
          <Caption className="font-black">{authors[0].name}</Caption>
        </>
      );
    }
    return (
      <div className="flex-y-center -space-x-1">
        {authors.map((author, i) => (
          <ProfileImage
            key={i}
            src={author.profileImage}
            name={author.name}
            size="tiny"
            className={`z-[${authors.length - i}]`}
          />
        ))}
      </div>
    );
  };

  return (
    <figcaption className="flex-x-center gap-4">
      <Label className="text-gray-base truncate">{title ? `${title} - ${description}` : description}</Label>
      <div className="flex-y-center gap-1 shrink-0">{renderAuthor()}</div>
    </figcaption>
  );
};

export default MetaInfo;
