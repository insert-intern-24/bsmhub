import React from 'react';

interface ButtonsProps {
  color?: 'black' | 'blue' | 'gray';
  text?: string;
  onClick?: () => void;
}

function Buttons({
  color = 'black',
  text = '추가하기',
  onClick,
}: ButtonsProps) {
  const bgColor = () => {
    switch (color) {
      case 'black':
        return 'bg-black';
      case 'blue':
        return 'bg-blue-primary';
      case 'gray':
        return 'bg-gray-base';
      default:
        return 'bg-black';
    }
  };

  return (
    <button
      className={`flex-center w-full h-[3.25rem] py-2 px-[1.375rem] gap-1 shrink-0 rounded-full text-white text-base font-bold leading-5 ${bgColor()}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default Buttons;
