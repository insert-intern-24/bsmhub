import Image from 'next/image';
import { Collection } from '@models/collection';
import { formatDate, formatEndDate } from '@/utils/date';

interface ContestItemProps extends Pick<Collection, "collection_id" | "collection_name" | "created_at" | "ended_at" | "image_url"> {
  onClick: (id: number) => void;
  selected: boolean;
}

function CollectionItem({ collection_id, collection_name, created_at, ended_at, image_url, onClick, selected = false }: ContestItemProps) {
  const imageSrc = (image_url || "/images/contest/Project.png") as string;
  const createdAt = formatDate(created_at);
  const endedAt = formatEndDate(ended_at);

  return (
    <div
      className={`w-fit h-fit border-solid border-[#E8E8EF] border-[1px] rounded-[5px] cursor-pointer ${selected && "selected"}`}
      onClick={() => onClick(collection_id)}
    >
      <Image
        src={imageSrc}
        alt="collection_image"
        width={(340 * 12) / 16}
        height={(200 * 12) / 16}
      />
      <div className="w-fit h-20 flex flex-col justify-center mx-3">
        <div className="text-titleColor text-base font-semibold leading-5">
          {collection_name}
        </div>
        <div className="text-detailColor text-xs leading-4">
          {createdAt}{endedAt}
        </div>
      </div>
    </div>
  );
}

export default CollectionItem;
