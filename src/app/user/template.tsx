import React from 'react';
import Image from 'next/image';
import TabButton from '@components/TabButton';
import DetailBox from '@components/DetailBox';

const UserTemplate = () => {
  return (
    <>
      {/* 유저 정보에 대한 상단 section */}
      <section>
        <Image src="images/profile/default.svg" alt="default-profile" width={90} height={90} />
        <div className="flex justify-between items-center mt-3">
          <div>
            <p className="text-2xl font-threat text-titleColor">GilDong Hong</p>
            <p className="text-detailColor text-base">1학년 2반 홍길동</p>
          </div>
          <button className="w-[13.75rem] flex gap-1 items-center justify-center bg-black px-5 py-2 rounded-3xl">
            <Image src="images/symbol/pick-plus.svg" alt="pick" width={14} height={14} />
            <span className='font-bold'>Pick</span>
          </button>
        </div>
      </section>
      {/* 홈/프로젝트/게시물에 대한 section */}
      <section>
        <nav className='border-strokeColor border-b-[0.12rem]'>
          <ul className="flex">
            <TabButton tab="home" />
            <TabButton tab="project" />
            <TabButton tab="posts" />
          </ul>
        </nav>
        <div className='w-full h-32 text-titleColor'>
          마크다운 들어가는 섹션
        </div>
        <div className='w-full h-32 flex gap-6'>
          <DetailBox />
          <DetailBox />
          <DetailBox />
          <DetailBox />
        </div>
      </section> 
    </>
    );
}

export default UserTemplate;