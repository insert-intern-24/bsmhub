'use client';
import React, { useRef, useEffect } from 'react';
import {
  IconCheck,
  IconSearch,
  IconCalendarWeekFilled,
} from '@tabler/icons-react';
import { StandardInputProps } from './types/inputTypes';

const iconMap: Record<string, React.ReactNode> = {
  check: <IconCheck size={20} className='text-gray-base'/>,
  search: <IconSearch size={20} className='text-gray-base'/>,
  calendar: <IconCalendarWeekFilled size={20} className='text-gray-base'/>,
};

function Inputs({
  mode = 'write',
  type = 'text',
  placeholder,
  value,
  onChange,
  name,
  required = false,
  id = '',
  icon,
}: StandardInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isReadOnly = mode === 'read';

  useEffect(() => {
    if (inputRef.current && mode === 'write') {
      inputRef.current.focus();
    }
  }, [mode]);

  return (
    <div className={`flex-row input-common px-2.5 ${isReadOnly ? '!bg-white' : ''} transition-colors`}>
      <input
        ref={inputRef}
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        required={required}
        readOnly={isReadOnly}
        className={`w-full py-1 text-gray-base text-body outline-none transition-colors
        ${type === 'date' ? 'date-input' : ''}
        ${isReadOnly ? 'bg-white cursor-default' : 'bg-light-gray-outline'}
      `}
      />
      {icon && iconMap[icon] && (
        <button type="button" aria-label={icon}>
          {iconMap[icon]}
        </button>
      )}
    </div>
  );
}

export default Inputs;
