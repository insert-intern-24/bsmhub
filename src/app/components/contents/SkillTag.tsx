'use client';

import React from "react";
import Image from "next/image";

interface TagProps {
  mode: 'default' | 'input' | 'cancel' | 'white'
  value?: string | null
}

const Tag = ({ mode, value }: TagProps) => {
  const children = 
    mode === 'input' ? (
      <input
        type='text'
        placeholder='입력해 추가하기...'
        className='max-w-28 flex justify-center items-center outline-none placeholder-placeholder-gray bg-transparent font-normal'
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            // 여기에 입력해서 추가하는 기능 넣으면 될듯
          }
        }}
      />
    ) : (
      <>
        {value} 
        {mode === 'cancel' && 
          <button onClick={() => {
            // 여기에 삭제하는 기능 넣으면 될듯
          }}>
            <Image 
              src='/shared/cancel.svg' 
              alt='cancel icon' 
              width={6} 
              height={6}
            /> 
          </button>
        }
      </>
    )

  return (
    <div 
      className={`min-w-16 max-w-fit inline-flex justify-center items-center gap-[0.3rem] px-3 py-1 rounded-full font-normal
        ${mode === 'white' ? 'bg-white' : 'bg-light-gray-input'}`}
    >
      {children}
    </div>
  )
}

export default Tag;