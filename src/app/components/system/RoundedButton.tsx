'use client';

import { ReactNode } from 'react';

interface RoundedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  gap?: number;
  fullWidth?: boolean;
}

const RoundedButton = ({
  children,
  onClick,
  className,
  gap = 3,
  fullWidth = true,
}: RoundedButtonProps) => {
  // 기본 스타일
  const baseClassName = 'rounded-3xl h-10 flex justify-center items-center !bg-black text-white cursor-pointer';
  
  // gap 클래스 처리 (Tailwind가 인식할 수 있도록 명시적으로)
  const gapClass = gap === 1 ? 'gap-1' : gap === 4 ? 'gap-4' : 'gap-3';
  
  // width 클래스 처리
  const widthClass = fullWidth ? 'w-full' : '';
  
  // className이 제공되면 완전히 오버라이드, 아니면 기본 스타일 사용
  const finalClassName = className + ' ' + baseClassName + ' ' + gapClass + ' ' + widthClass;
  return <button className={finalClassName} onClick={onClick}>{children}</button>;
};

export default RoundedButton;
