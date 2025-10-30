import React from 'react';
import Image from 'next/image';
import MetaInfo from './MetaInfo';
import Link from 'next/link';
import { converIsTeamToUrl } from '@/utils/convertIsTeamToUrl';

export interface CardProps {
  id: number;
  title?: string;
  description: string;
  projectImage: string;
  ownerName: string;
  isTeam: boolean;
  category?: string;
  authors: {
    name?: string;
    profileImage: string;
  }[];
}

const Card = ({
  title,
  description,
  projectImage,
  ownerName,
  isTeam,
  authors,
}: CardProps) => {
  const href = title
    ? `/${converIsTeamToUrl(isTeam)}/${ownerName}/${title}`
    : `/${converIsTeamToUrl(isTeam)}/${ownerName}`;

  return (
    <Link href={href} className="cursor-pointer">
      <div className="w-full mobile:max-w-full mobile:min-w-[26rem] max-w-[26rem] flex-col gap-[0.375rem]">
        <figure className="relative h-60 mobile:h-80 aspect-video rounded-[0.25rem] overflow-hidden">
          <Image
            src={projectImage}
            alt={`${title || ownerName} 프로젝트 이미지`}
            fill
            className="object-cover"
          />
        </figure>
        <MetaInfo description={description} authors={authors} />
      </div>
    </Link>
  );
};

export default Card;
