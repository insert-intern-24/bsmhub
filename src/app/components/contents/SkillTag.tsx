'use client';

import { IconX } from '@tabler/icons-react';
import React from 'react';

interface TagProps {
  mode: 'default' | 'input' | 'cancel' | 'white';
  value?: string | null;
  onClick?: () => void;
}

const SkillTag = ({ mode, value, onClick }: TagProps) => {
  const children =
    mode === 'input' ? (
      <input
        type="text"
        placeholder="입력해 추가하기..."
        className="max-w-28 flex-center outline-none placeholder-placeholder-gray bg-transparent font-normal"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onClick?.();
          }
        }}
      />
    ) : (
      <>
        {value}
        {mode === 'cancel' && (
          <button onClick={() => onClick}>
            <IconX width={10} height={10} />
          </button>
        )}
      </>
    );

  return (
    <div
      className={`min-w-16 max-w-fit inline-flex-center gap-[0.3rem] px-3 py-1 rounded-full font-normal
        ${mode === 'white' ? 'bg-white' : 'bg-light-gray-input'}`}
    >
      {children}
    </div>
  );
};

export default SkillTag;
