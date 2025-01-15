import Image from 'next/image';
import { Collection } from '@models/collection';

interface ContestItemProps extends Pick<Collection, "id" | "title" | "startDate" | "endDate" | "thumbnail"> {
  onClick: (id: number) => void;
  selected: boolean;
}

function CollectionItem({ id, title, startDate, endDate = null , thumbnail = null, onClick, selected = false }: ContestItemProps) {
  return (
    <div
      className={`w-fit h-fit border-solid border-[#E8E8EF] border-[1px] rounded-[5px] cursor-pointer ${selected && "selected"}`}
      onClick={() => onClick(id)}
    >
      <Image
        src="/images/contest/Project.png"
        alt="contest1"
        width={(340 * 12) / 16}
        height={(200 * 12) / 16}
      />
      <div className="w-full h-20 flex flex-col justify-center mx-3">
        <div className="text-titleColor text-base font-semibold leading-5">
          {title}
        </div>
        <div className="text-detailColor text-xs leading-4">
          {startDate} ~ {endDate}
        </div>
      </div>
    </div>
  );
}

export default CollectionItem;
