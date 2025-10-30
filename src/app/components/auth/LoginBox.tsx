'use client';

import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

type LoginBoxProps = {
  className?: string;
  title?: string;
  description?: string;
};

const LoginBox: React.FC<LoginBoxProps> = ({
  className = '',
  title = '로그인하기',
  description = 'Google 계정으로 계속 진행하세요.',
}) => {
  return (
    <section
      className={`h-full w-[26rem] mobile:hidden rounded-[0.25rem] border border-[#F8DBEA] bg-white bg-[url('/card/loginBox.png')] bg-no-repeat bg-center bg-cover flex flex-col justify-center ${className}`}
    >
      <div className="flex flex-col items-center text-center px-6 gap-1">
        <h2 className="text-title">{title}</h2>
        <p className="text-body text-gray-footer">{description}</p>
        <Link
          href="/auth/login"
          className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-[light-gray-outline] bg-white/70 backdrop-blur-sm px-4 py-2"
          aria-label="Google로 로그인"
        >
          <Image src="/icon/google.svg" alt="Google" width={16} height={16} />
          <span className="text-label2">Google로 로그인</span>
        </Link>
      </div>
    </section>
  );
};

export default LoginBox;


