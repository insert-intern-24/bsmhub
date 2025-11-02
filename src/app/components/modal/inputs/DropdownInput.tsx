'use client';

import React, { useRef, useEffect } from 'react';
import {
  IconCheck,
  IconSearch,
  IconCalendarWeekFilled,
} from '@tabler/icons-react';
import { StandardInputProps } from './types/inputTypes';
import { DropdownInputConfig } from './InputListProvider';

const iconMap: Record<string, React.ReactNode> = {
  check: <IconCheck size={20} className="text-gray-base" />,
  search: <IconSearch size={20} className="text-gray-base" />,
  calendar: <IconCalendarWeekFilled size={20} className="text-gray-base" />,
};

interface DropdownInputProps extends StandardInputProps {
  suggestions: Record<string, unknown>[];
  onInputChange: (value: string) => void;
  dropdownInputConfig: DropdownInputConfig;
}

function DropdownInput({
  mode = 'write',
  type = 'text',
  placeholder,
  value,
  onChange,
  name,
  required = false,
  id = '',
  icon,
  suggestions,
  onInputChange,
  dropdownInputConfig,
}: DropdownInputProps) {
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
      } transition-colors relative`}
    >
      <input
        ref={inputRef}
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange?.(e);
          onInputChange?.(e.target.value);
        }}
        name={name}
        required={required}
        readOnly={isReadOnly}
        className={`w-full py-1 text-gray-base text-body outline-none transition-colors
        ${type === 'date' ? 'date-input' : ''}
        ${isReadOnly ? 'bg-white cursor-default' : 'bg-light-gray-outline'}
      `}
      />
      {icon && iconMap[icon] && <button type="button">{iconMap[icon]}</button>}
      {suggestions.length > 0 && (
        <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto min-w-64 top-full">
          {suggestions.map((item, index) => (
            <li
              key={index}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100"
              onMouseDown={(e) => {
                e.preventDefault();
                onChange?.({
                  target: {
                    value: item[dropdownInputConfig.valueColumnName] as string,
                  },
                } as React.ChangeEvent<HTMLInputElement>);
                onInputChange?.('');
              }}
            >
              {item[dropdownInputConfig.nameColumnName] as string}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DropdownInput;
