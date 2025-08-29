import React from 'react';
import Image from 'next/image';
import MetaInfo from './MetaInfo';

interface CardProps {
  id: number;
  title: string;
  projectImage: string;
  author: {
    name: string;
    profileImage: string;
  };
}

const Card = ({ title, projectImage, author }: CardProps) => {
  return (
    <div className="w-fit flex flex-col gap-[0.375rem]">
      <figure className="relative w-[21rem] h-[11.8125rem]">
        <Image
          src={projectImage}
          alt={`${title} 프로젝트 이미지`}
          fill
          className="object-cover"
        />
      </figure>
      <MetaInfo title={title} author={author} />
    </div>
  );
};

export default Card;
