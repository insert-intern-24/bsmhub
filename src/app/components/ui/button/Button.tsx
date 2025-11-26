import React from 'react';

interface ButtonProps {
  text?: string;
  color?: 'black' | 'blue' | 'gray';
  onClick?: () => void;
  disabled?: boolean;
}

const Button = ({
  color = 'black',
  text = '추가하기',
  onClick,
  disabled = false,
}: ButtonProps) => {
  const bgColorMap: Record<'black' | 'blue' | 'gray', string> = {
    black: 'bg-black',
    blue: 'bg-blue-primary',
    gray: 'bg-light-gray',
  };

  const textColor = color === 'gray' ? 'text-black' : 'text-white';

  return (
    <button
      className={`flex-col justify-center w-full h-[3.25rem] py-2 shrink-0 rounded-full ${textColor} text-body2 ${bgColorMap[color]} ${disabled ? 'opacity-80 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
