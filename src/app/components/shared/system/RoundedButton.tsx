'use client';

import { ReactNode } from 'react';

interface RoundedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

const RoundedButton = ({
  children,
  onClick,
  className = '',
}: RoundedButtonProps) => {
  const baseClassName = 'rounded-3xl h-10 flex justify-center items-center gap-3 bg-black text-white w-full cursor-pointer';
  const finalClassName = `${baseClassName} ${className}`.trim();

  return (
    <button className={finalClassName} onClick={onClick}>
      {children}
    </button>
  );
};

export default RoundedButton;

