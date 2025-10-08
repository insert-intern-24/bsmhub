import React from 'react';
import { IconSquareCheckFilled, IconSquareCheck } from '@tabler/icons-react';

interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
}

const Checkbox = ({ checked = false, onChange, label = '체크박스' }: CheckboxProps) => {
  return (
    <label
      className="flex flex-row items-center gap-2 cursor-pointer select-none"
      onClick={() => onChange?.(!checked)}
    >
      {checked ? (
        <IconSquareCheckFilled className="w-8" />
      ) : (
        <IconSquareCheck className="w-8" />
      )}{' '}
      {label}
    </label>
  );
};

export default Checkbox;
