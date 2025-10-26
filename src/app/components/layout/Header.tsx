import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Label } from '../system/text';

export const navigation = [
  { label: '프로젝트', href: '/project' },
  { label: '동아리', href: '/team' },
  { label: '포트폴리오', href: '/portfolio' },
  { label: '대회', href: '/major' },
];

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-white h-14 border-b border-[light-gray-outline] px-[33px] mobile:px-[0.6875rem]">
      <div className="max-w-[109rem] mx-auto h-full flex justify-between items-center responsive-header">
        <Link href="/" className="flex-row items-center">
          <Image
            src="/icon/logo.svg"
            alt="Logo"
            width="21"
            height="21"
            className="pr-2"
          />
          <div className="text-xl text-titleColor whitespace-nowrap">
            <b>부산소프트웨어마이스터고</b> 프로젝트의장
          </div>
        </Link>
        <nav className="flex-row gap-4 items-center mobile:hidden">
          {navigation.map((item) => (
            <Link key={item.label} href={item.href}>
              <Label>{item.label}</Label>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
