'use client';
import React, { useRef, useEffect } from 'react';
import { StandardInputProps } from './types/inputTypes';

const Inputs = ({
  mode = 'write',
  type = 'text',
  placeholder,
  value,
  onChange,
  name,
  required = false,
  id = '',
}: StandardInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const isReadOnly = mode === 'read';

  useEffect(() => {
    if (inputRef.current && mode === 'write') {
      inputRef.current.focus();
    }
  }, [mode]);

  return (
    <div
      className={`flex-row input-common px-2.5 ${
        isReadOnly ? '!bg-white' : ''
      } transition-colors`}
    >
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
    </div>
  );
};

export default Inputs;
