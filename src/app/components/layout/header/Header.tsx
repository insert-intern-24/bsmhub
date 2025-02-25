import React from 'react';
import Link from 'next/link';
import AccountComponent from './AccountComponent';

export default function Header() {
  return (
    <header className="select-none bg-white border-b-[0.12rem] border-strokeColor w-[100%] fixed top-0 z-40">
      <div className="flex items-center justify-between max-w-outer mx-auto py-3">
        <Link href="/" className="text-xl text-titleColor">
          <b>부산소프트웨어마이스터고</b> 프로젝트의장
        </Link>
        <div className="flex items-center gap-4">
          <nav>
            <ul className="flex text-titleColor gap-4">
              <li>
                <Link href="/project">프로젝트</Link>
              </li>
              <li>
                <Link href="">동아리</Link>
              </li>
              <li>
                <Link href="">포트폴리오</Link>
              </li>
              <li>
                <Link href="/community">커뮤니티</Link>
              </li>
            </ul>
          </nav>
          <AccountComponent />
        </div>
      </div>
    </header>
  );
}
