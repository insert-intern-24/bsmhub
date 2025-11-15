import React from 'react';

interface ButtonProps {
  text?: string;
  color?: 'black' | 'blue' | 'gray';
  onClick?: () => void;
}

function Button({
  color = 'black',
  text = '추가하기',
  onClick,
}: ButtonProps) {
  const bgColorMap: Record<'black' | 'blue' | 'gray', string> = {
    black: 'bg-black',
    blue: 'bg-blue-primary',
    gray: 'bg-light-gray',
  };

  const textColor = color === 'gray' ? 'text-black' : 'text-white';

  return (
    <button
      className={`flex-col justify-center w-full h-[3.25rem] py-2 shrink-0 rounded-full ${textColor} text-body2 ${bgColorMap[color]}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default Button;
