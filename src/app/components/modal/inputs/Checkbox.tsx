'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface CheckboxProps {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

const Checkbox = ({ checked, onChange, label = '체크박스' }: CheckboxProps) => {
  const [state, setState] = useState(false);
  const isChecked = checked ?? state;

  return (
    <label
      className="flex flex-row items-center gap-2 cursor-pointer select-none"
      onClick={() => {
        const next = !isChecked;
        setState(next);
        onChange?.(next);
      }}
    >
      <Image
        src={isChecked ? '/icon/checkbox-fill.svg' : '/icon/checkbox.svg'}
        alt={isChecked ? '체크됨' : '체크 안 됨'}
        width={20}
        height={20}
        className="transition-opacity"
      />
      {label}
    </label>
  );
};

export default Checkbox;
