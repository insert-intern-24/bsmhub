import React from 'react';

interface ButtonsProps {
  color?: 'black' | 'blue' | 'red' | 'green' | 'gray';
  text?: string;
  onClick?: () => void;
}

function Buttons({
  color = 'black',
  text = '추가하기',
  onClick,
}: ButtonsProps) {
  const bgColorMap = {
    black: 'bg-black',
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    green: 'bg-green-500',
    gray: 'bg-gray-500',
  };

  const bgClass = bgColorMap[color as keyof typeof bgColorMap] || 'bg-black';

  return (
    <button
      className={`flex w-full h-[3.25rem] py-2 px-[1.375rem] justify-center items-center gap-1 shrink-0 rounded-full ${bgClass} text-white text-base font-bold leading-5`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default Buttons;
