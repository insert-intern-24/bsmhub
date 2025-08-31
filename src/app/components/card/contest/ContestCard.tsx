import React from 'react';
import Image from 'next/image';
import { Body2, Caption } from '../../system/text';

interface ContestCardProps {
  title: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
}

const ContestCard = ({
  title,
  imageUrl,
  startDate,
  endDate,
}: ContestCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];

    return `${year}.${month}.${day}(${dayOfWeek})`;
  };

  const formatPeriod = (start: string, end: string) => {
    return `${formatDate(start)} ~ ${formatDate(end)}`;
  };

  return (
    <div className="flex flex-col w-fit h-fit rounded bg-white gap-[0.125rem]">
      {/* Image Section */}
      <div className="relative w-[22.0625rem] h-[13.53rem]">
        <Image src={imageUrl} alt={title} fill className="object-cover" />
      </div>

      {/* Content Section */}
      <div className="px-3 py-2 flex flex-col gap-[0.375rem]">
        <Body2 className="text-black">{title}</Body2>
        <Caption className="text-gray-base">
          {formatPeriod(startDate, endDate)}
        </Caption>
      </div>
    </div>
  );
};

export default ContestCard;