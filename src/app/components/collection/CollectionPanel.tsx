import React from 'react';
import ContestInformation from '@/app/components/Information';
import Hr from '@components/Hr';
import DetailBoxes from '../detail/DetailBoxes';
import { Collection, Detail } from '@models/collection';
import { formatEndDate } from '@/utils/date';
import { formatDate } from '@/utils/date';

interface CollectionPanelProps {
  collection: Collection;
}

function CollectionPanel({ collection }: CollectionPanelProps) {
  const endedAt = formatEndDate(collection.ended_at);

  return (
    <aside className="max-w-[21.0625rem] w-full bg-contest-gradient px-10">
      <div className="mt-[12.5rem]">
        <header className="flex flex-col gap-4">
          <div className="flex flex-col gap-[0.4rem]">
            <span className="text-2xl font-bold">{collection.collection_name} </span>
            <span className="text-base text-detailColor">
              {formatDate(collection.created_at)}{endedAt}
            </span>
          </div>
          <button className="w-full py-2 bg-titleColor rounded-[30px] font-bold text-white">
            입장하기
          </button>
          <div className="flex flex-col gap-1 text-[1rem]">
            <ContestInformation name="대상" value={collection.competition?.target} />
            <ContestInformation name="참여인원" value={collection.competition?.pax} />
            <ContestInformation name="조회수" value={collection.view} />
          </div>
        </header>
        <Hr />
        <main className="flex flex-col gap-8">
        <DetailBoxes
          details={collection?.details as Detail[]}
          type="col"
        />
        </main>
      </div>
    </aside>
  );
}

export default CollectionPanel;
