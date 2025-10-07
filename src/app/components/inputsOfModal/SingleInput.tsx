'use client';
import React, { useRef, useEffect } from 'react';
import {
  // IconPencil,
  IconCheck,
  IconSearch,
  IconCalendarWeekFilled,
} from '@tabler/icons-react';
import { BaseInputProps } from './types/inputTypes';

const iconMap: Record<string, React.ReactNode> = {
  // lock: <IconPencil size={20} className='text-gray-base'/>,
  edit: <IconCheck size={20} className='text-gray-base'/>,
  search: <IconSearch size={20} className='text-gray-base'/>,
  date: <IconCalendarWeekFilled size={20} className='text-gray-base'/>,
};

function Inputs({
  type = 'text',
  placeholder,
  value,
  onChange,
  name,
  required = false,
  id = '',
}: BaseInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className={`flex-row input-common px-2.5 ${type === 'lock' ? 'bg-white' : ''} transition-colors`}>
      <input
        ref={inputRef}
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        required={required}
        readOnly={type === 'lock'}
        className={`w-full py-1 text-gray-base text-body outline-none transition-colors
        ${type === 'date' ? 'date-input' : ''}
        ${type === 'lock' ? 'bg-white' : 'bg-light-gray-outline'}
      `}
      />
      {iconMap[type] && (
        <button>{iconMap[type]}</button>
      )}
    </div>
  );
}

export default Inputs;
