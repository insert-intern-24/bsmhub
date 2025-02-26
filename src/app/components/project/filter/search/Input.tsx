import React from 'react';

export default function Input() {
  return (
    <>
      <div className="flex items-center gap-3 self-stretch">
        <span className="text-textBasic text-base font-bold leading-[150%] tracking-normal">
          검색어
        </span>
        <div className="flex  items-center gap-2 flex-1 rounded-3xl border border-[#D8D8D8] px-2 max-w-[23.125rem] bg-white min-h-[3rem]">
          <input
            type="text"
            placeholder="검색어를 입력해주세요."
            className="flex-1 text-textDisabled text-base font-normal leading-[150%] tracking-normal"
          />
          <span
            className="material-symbols-outlined"
            style={{
              fontVariationSettings:
                "'FILL' 1, 'wght' 200, 'GRAD' 0, 'opsz' 18",
            }}
          >
            search
          </span>
        </div>
        <button className="flex min-w-20 px-4 justify-center items-center gap-1 rounded-[3.125rem] bg-black min-h-[3rem]">
          <span className="flex-1 text-white text-center text-base font-normal leading-[150%] tracking-normal">
            적용하기
          </span>
        </button>
      </div>
    </>
  );
}
