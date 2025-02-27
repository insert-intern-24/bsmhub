import React from 'react';
import ContestInformation from '@components/information/Information';
import Hr from '@components/Hr';
import DetailBoxes from '../detail/DetailBoxes';
import { Collection } from '@models/collection';

interface CollectionPanelProps {
  collection: Collection;
}

function CollectionPanel({ collection }: CollectionPanelProps) {
  return (
    <aside className="max-w-[21.0625rem] w-full bg-contest-gradient px-10">
      <div className="mt-[12.5rem]">
        <header className="flex flex-col gap-4">
          <div className="flex flex-col gap-[0.4rem]">
            <span className="text-2xl font-bold">{collection.title} </span>
            <span className="text-base text-detailColor">
              {collection.startDate} ~ {collection.endDate}
            </span>
          </div>
          <button className="w-full py-2 bg-titleColor rounded-[30px] font-bold text-white">
            입장하기
          </button>
          <div className="flex flex-col gap-1 text-[1rem]">
            <ContestInformation name="대상" value={collection.info.target} />
            <ContestInformation name="참여인원" value={collection.info.pax} />
            <ContestInformation name="조회수" value={collection.info.views} />
          </div>
        </header>
        <Hr/>
        <main className="flex flex-col gap-8">
          <DetailBoxes details={Array.isArray(collection.details) ? collection.details : []} type="collection" />
        </main>
      </div>
    </aside>
  );
}

export default CollectionPanel;
