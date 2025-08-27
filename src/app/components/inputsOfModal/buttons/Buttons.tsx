import React from 'react';

interface ButtonsProps {
  color?: string;
  text?: string;
}

function Buttons({ color = 'black', text = '추가하기' }: ButtonsProps) {
  return (
    <>
      <button
        className={`flex w-full h-[3.25rem] py-2 px-[1.375rem] justify-center items-center gap-1 shrink-0 rounded-full bg-${color} text-white text-base font-bold leading-5`}
      >
        {text}
      </button>
    </>
  );
}

export default Buttons;
