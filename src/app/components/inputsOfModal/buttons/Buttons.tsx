import React from 'react';

interface ButtonsProps {
  color?: string; // 문자열로 변경
  text?: string;
  onClick?: () => void;
}

function Buttons({
  color = 'black',
  text = '추가하기',
  onClick,
}: ButtonsProps) {
  return (
    <button
      className="flex-center w-full h-[3.25rem] py-2 px-[1.375rem] gap-1 shrink-0 rounded-full text-white text-base font-bold leading-5"
      style={{ backgroundColor: color }}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default Buttons;
