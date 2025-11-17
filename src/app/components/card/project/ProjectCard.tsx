import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import MetaInfo from './MetaInfo';
import { convertIsTeamToUrl } from '@/utils/convertIsTeamToUrl';
import { convertFromDatabaseImageURL } from '@/services/supabase/imageHostConverter';

export interface ProjectCardProps {
  id: number;
  title?: string;
  description: string;
  projectImage: string;
  ownerName: string;
  ownerProfileImage?: string;
  isTeam: boolean;
  category?: string;
  authors: {
    name?: string;
    profileImage: string;
  }[];
}

// 하위 호환성을 위한 타입 별칭
export type CardProps = ProjectCardProps;

const ProjectCard = ({
  title,
  description,
  projectImage,
  ownerName,
  ownerProfileImage,
  isTeam,
  authors,
}: ProjectCardProps) => {
  const href = title
    ? `/${convertIsTeamToUrl(isTeam)}/${ownerName}/${title}`
    : `/${convertIsTeamToUrl(isTeam)}/${ownerName}`;

  return (
    <Link href={href} className="cursor-pointer">
      <div className="w-full mobile:max-w-full mobile:min-w-[26rem] max-w-[26rem] flex-col gap-[0.375rem]">
        <figure className="relative h-60 mobile:h-80 aspect-video rounded-[0.25rem] overflow-hidden">
          <Image
            src={convertFromDatabaseImageURL(projectImage)}
            alt={`${title || ownerName} 프로젝트 이미지`}
            fill
            className="object-cover"
          />
        </figure>
        <MetaInfo
          title={title}
          description={description}
          ownerName={ownerName}
          ownerProfileImage={ownerProfileImage}
          authors={authors}
        />
      </div>
    </Link>
  );
};

export default ProjectCard;
