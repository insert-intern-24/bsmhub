import React from 'react';
import Image from 'next/image';
import { Body2, Caption } from '@/app/components/shared/system/text';
import { formatPeriod } from '@/utils/date';

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
  return (
    <div className="flex-col w-fit h-fit rounded bg-white gap-[0.125rem]">
      {/* Image Section */}
      <div className="relative w-[22.0625rem] h-[13.53rem]">
        <Image src={imageUrl} alt={title} fill className="object-cover" />
      </div>

      {/* Content Section */}
      <div className="px-3 py-2 flex-col gap-[0.275rem]">
        <Body2 className="text-black">{title}</Body2>
        <Caption className="text-gray-base">
          {formatPeriod(startDate, endDate)}
        </Caption>
      </div>
    </div>
  );
};

export default ContestCard;
