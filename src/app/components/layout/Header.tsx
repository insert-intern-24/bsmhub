import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Label } from '../system/text';

export const navigation = [
  { label: '프로젝트', href: '/projects/all' },
  { label: '동아리', href: '/clubs/all' },
  { label: '포트폴리오', href: '/portfolio' },
  { label: '대회', href: '/majors/all' },
];

const Header = () => {
  return (
    <header className="bg-white p-white-space-margin flex-center h-14 border-b border-[light-gray-outline] responsive-header">
      <div className="flex-row items-center">
        <Image
          src="/icon/logo.svg"
          alt="Logo"
          width="21"
          height="21"
          className="pr-2"
        />
        <Link href="/" className="text-xl text-titleColor whitespace-nowrap">
          <b>부산소프트웨어마이스터고</b> 프로젝트의장
        </Link>
      </div>
      <nav className="flex-row gap-4 mobile:hidden">
        {navigation.map((item) => (
          <Link key={item.label} href={item.href}>
            <Label>{item.label}</Label>
          </Link>
        ))}
      </nav>
    </header>
  );
};

export default Header;
