'use client';

import React, { useRef, useEffect } from 'react';
import {
  IconCheck,
  IconSearch,
  IconCalendarWeekFilled,
} from '@tabler/icons-react';
import { StandardInputProps } from './types/inputTypes';
import { DropdownInputConfig } from '@/app/components/modal/inputs/InputListProvider';

const iconMap: Record<string, React.ReactNode> = {
  check: <IconCheck size={20} className="text-gray-base" />,
  search: <IconSearch size={20} className="text-gray-base" />,
  calendar: <IconCalendarWeekFilled size={20} className="text-gray-base" />,
};

interface DropdownInputProps extends StandardInputProps {
  dropdownInputConfig: DropdownInputConfig;
  suggestions: Record<string, unknown>[];
  tableData?: Record<string, unknown>[];
  onInputChange: (value: string) => void;
  onInputFocus?: () => void;
  onOptionSelect?: () => void;
  onlyOne?: boolean;
  onDelete?: () => void;
}

const DropdownInput = ({
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
  tableData = [],

  onInputChange,
  onInputFocus,
  dropdownInputConfig,
  onOptionSelect,
  onlyOne = false,
  onDelete,
}: DropdownInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const isReadOnly = mode === 'read';

  useEffect(() => {
    if (inputRef.current && mode === 'write') {
      inputRef.current.focus();
    }
  }, [mode]);

  // 선택된 값이 있는지 확인
  const valueStr = value !== undefined && value !== null ? String(value) : '';
  const selectedItem = tableData.find(
    (item) => String(item[dropdownInputConfig.valueColumnName]) === valueStr,
  );
  const displayName = selectedItem
    ? (selectedItem[dropdownInputConfig.nameColumnName] as string)
    : '';

  // 선택된 값이 있고 displayName이 있으면 선택된 값 표시 모드
  const hasSelectedValue = Boolean(valueStr !== '' && displayName);
  const showDisplayNameInInput = hasSelectedValue;
  
  // X 버튼 표시 조건: 선택된 값이 있고 onDelete가 있으면 표시
  const showDeleteButton = hasSelectedValue && onDelete;

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
        value={showDisplayNameInInput ? displayName : value}
        onChange={(e) => {
          onChange?.(e);
          onInputChange?.(e.target.value);
        }}
        onFocus={onInputFocus}
        onClick={(e) => {
          // readOnly이거나 선택된 값이 표시될 때 클릭 시 드롭다운 열기
          if ((isReadOnly || showDisplayNameInInput) && onInputFocus) {
            e.preventDefault();
            onInputFocus();
          }
        }}
        name={name}
        required={required}
        readOnly={isReadOnly || showDisplayNameInInput}
        className={`w-full py-1 text-gray-base text-body outline-none transition-colors
        ${type === 'date' ? 'date-input' : ''}
        bg-transparent
        ${isReadOnly || showDisplayNameInInput ? 'cursor-pointer' : ''}
      `}
      />
      {showDeleteButton && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
            // 삭제 후 드롭다운 열기
            if (onInputFocus) {
              setTimeout(() => {
                onInputFocus();
              }, 0);
            }
          }}
          className="text-gray-500 hover:text-gray-700 px-1"
        >
          ×
        </button>
      )}
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
                onOptionSelect?.();
              }}
            >
              {item[dropdownInputConfig.nameColumnName] as string}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownInput;
