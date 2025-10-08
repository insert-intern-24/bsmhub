import React, { useState } from 'react';
import { IconSquareCheckFilled, IconSquareCheck } from '@tabler/icons-react';

interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
}

const Checkbox = ({ checked, onChange, label = '체크박스' }: CheckboxProps) => {
  const [state, setState] = useState(false);
  
  return (
    <label
      className="flex flex-row items-center gap-2 cursor-pointer select-none"
      onClick={() => {
        const next = !(checked ?? state);
        setState(next);
        onChange?.(next);
      }}
    >
      {(checked ?? state) ? (
        <IconSquareCheckFilled className="w-8" />
      ) : (
        <IconSquareCheck className="w-8" />
      )}{' '}
      {label}
    </label>
  );
};

export default Checkbox;
