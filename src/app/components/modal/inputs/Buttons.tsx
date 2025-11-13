import React from 'react';

interface ButtonsProps {
  text?: string;
  color?: 'black' | 'blue' | 'gray';
  onClick?: () => void;
}

function Buttons({
  color = 'black',
  text = '추가하기',
  onClick,
}: ButtonsProps) {
  const bgColorMap: Record<'black' | 'blue' | 'gray', string> = {
    black: 'bg-black',
    blue: 'bg-blue-primary',
    gray: 'bg-gray-base',
  };

  return (
    <button
      className={`flex-col justify-center w-full h-[3.25rem] py-2 shrink-0 rounded-full text-white text-body2 ${bgColorMap[color]}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default Buttons;
