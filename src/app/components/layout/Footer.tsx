import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Body, Heading } from '@/app/components/shared/system/text';

const Footer = () => {
  return (
    <footer className="py-10 bg-light-gray-footer-bg text-gray-footer px-[33px] mobile:px-[0.6875rem]">
      <div className="max-w-[109rem] mx-auto flex justify-between items-center gap-6 responsive-footer">
        <div className="flex flex-col mobile:mr-auto">
          <Link href="" className="text-xl mb-4">
            <Heading>부산소프트웨어마이스터고 프로젝트의장</Heading>
          </Link>
          <Link href="https://maps.app.goo.gl/4BsSV2Kr4PXQ6JYD8">
            <Body className="">
              부산광역시 강서구 가락대로 1393 부산소프트웨어마이스터고등학교
            </Body>
            <Body>산학문의 (051) 000-0000</Body>
          </Link>
        </div>
        <div className="mobile:ml-auto">
          <div className="flex gap-4 mb-2">
            <Link href="">
              <Body>Term of Use</Body>
            </Link>
            <Link href="">
              <Body>Privacy Policy</Body>
            </Link>
          </div>
          <div className="flex gap-2 justify-end">
            <Image
              src="/icon/insert.svg"
              alt="insert-logo"
              width={21}
              height={20}
            />
            <span>
              <Body>Powered by INSERT</Body>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
