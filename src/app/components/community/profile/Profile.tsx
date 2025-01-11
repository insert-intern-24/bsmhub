import React from 'react';

export default function Profile() {
  return (
    <>
      <div className="flex pt-[1.375rem] pb-[0.75rem] px-8 flex-col items-center gap-2 rounded-[1rem] bg-white">
        <div className="w-[6.25rem] h-[6.25rem] rounded-[6.25rem] bg-customGray2"></div>
        <div className="flex flex-col items-center gap-1 self-stretch">
          <span className="self-stretch text-black text-center  text-base font-bold leading-none ">
            이준호
          </span>
          <span className="text-descriptionColor text-center  text-sm font-normal leading-none">
            Backend, DevOps
          </span>
          <span className="text-followBlue text-center  text-sm font-normal leading-none py-2">
            Follow
          </span>
        </div>
      </div>
    </>
  );
}
