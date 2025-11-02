import React, { useState } from 'react';

interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
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
        className="material-symbols-outlined text-[24px] transition-colors"
        style={{ 
          fontVariationSettings: `'FILL' ${isChecked ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`,
          fontFamily: "'Material Symbols Outlined'",
          fontWeight: 'normal',
          fontStyle: 'normal',
        }}
      >
        {isChecked ? 'check_box' : 'check_box_outline_blank'}
      </span>
      {label}
    </label>
  );
};

export default Checkbox;
