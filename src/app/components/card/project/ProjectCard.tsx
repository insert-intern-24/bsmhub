import React from 'react';
import Image from 'next/image';
import MetaInfo from './MetaInfo';

export interface CardProps {
  id: number;
  title: string;
  projectImage: string;
  authors: {
    name?: string;
    profileImage: string;
  }[];
}

const Card = ({ title, projectImage, authors }: CardProps) => {
  return (
    <div className="w-full min-w-[24rem] flex-col gap-[0.375rem]">
      <figure className="relative h-60 mobile:h-80 aspect-video rounded-[0.25rem] overflow-hidden">
        <Image
          src={projectImage}
          alt={`${title} 프로젝트 이미지`}
          fill
          className="object-cover"
        />
      </figure>
      <MetaInfo title={title} authors={authors} />
    </div>
  );
};

export default Card;
