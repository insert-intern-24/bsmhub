'use client';

import React, { useState } from 'react';

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
      <span 
        className="material-symbols-outlined transition-colors"
        style={{ 
          fontSize: '24px',
          fontVariationSettings: `'FILL' ${isChecked ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`
        }}
      >
        {isChecked ? 'check_box' : 'check_box_outline_blank'}
      </span>
      {label}
    </label>
  );
};

export default Checkbox;
