import React from 'react';
import Image from 'next/image';

const ProjectAddCard = () => {
  return (
    <div className="w-fit flex flex-col gap-[0.375rem]">
      <div className="relative w-[21rem] h-[11.8125rem] rounded-[0.25rem] bg-light-gray-outline flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Image
            src="/card/add.png"
            alt="프로젝트 추가"
            width={(76 * 12) / 16}
            height={(76 * 12) / 16}
          />
        </div>
      </div>
      {/* MetaInfo 영역과 동일한 높이 확보 */}
      <div className="h-[1.25rem]"></div>
    </div>
  );
};

export default ProjectAddCard;
