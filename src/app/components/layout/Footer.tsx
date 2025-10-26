import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Body, Heading } from '../system/text';

export default function Footer() {
  return (
    <footer className="p-white-space-margin py-10 bg-light-gray-footer-bg flex-center gap-6 text-gray-footer responsive-footer mobile:px-[0.6875rem] mb-24">
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
    </footer>
  );
}
