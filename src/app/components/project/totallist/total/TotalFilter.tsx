import React from 'react';
import divider from '@public/images/icon/divider.svg';
import Image from 'next/image';

export default function TotalFilter() {
  return (
    <>
      <div className="flex items-center gap-3 bg-white">
        <div className="flex items-center gap-3 bg-white">
          <span className="text-black text-base font-bold leading-[150%] tracking-normal">
            목록 표시 개수
          </span>
          <div className="flex px-1 items-center gap-[0.5rem] rounded bg-white">
            <span>12개</span>
            <span
              className="material-symbols-outlined"
              style={{
                fontVariationSettings:
                  "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 14",
                fontSize: '1.5rem',
              }}
            >
              keyboard_arrow_down
            </span>
          </div>
        </div>
        <Image src={divider} alt="divider" width={1} height={16} />
        <div className="flex items-center gap-3 bg-white">
          <span className="text-black text-base font-bold leading-[150%] tracking-normal">
            정렬기준
          </span>
          <div className="flex items-center gap-2 rounded-xl bg-white">
            <span className="flex px-1 items-center gap-[0.5rem] rounded">
              최신순
            </span>
            <span className="flex px-1 items-center gap-[0.5rem] rounded">
              인기순
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
