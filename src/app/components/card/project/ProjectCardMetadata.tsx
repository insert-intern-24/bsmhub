import React from 'react';
import { Caption, Label } from '../../ui/text/text';
import ProfileImage from '@/app/components/ui/profile/ProfileImage';

interface ProjectCardMetadataProps {
  description: string;
  authors: {
    name?: string;
    profileImage: string;
  }[];
}

const ProjectCardMetadata = ({ description, authors }: ProjectCardMetadataProps) => {
  return (
    <figcaption className="flex-x-center gap-4">
      <Label className="text-gray-base truncate">{description}</Label>
      <div className="flex-y-center gap-1 shrink-0">
        {authors.length === 1 ? (
          // 작성자가 1명인 경우: 프로필 사진 + 이름
          <>
            <ProfileImage
              src={authors[0].profileImage}
              name={authors[0].name ?? ''}
              size="tiny"
            />
            <Caption className="font-black">{authors[0].name}</Caption>
          </>
        ) : (
          // 작성자가 여러명인 경우: 프로필 사진만 나열
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

export default ProjectCardMetadata;
