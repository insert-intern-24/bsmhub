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
  textarea = false,
}: StandardInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isReadOnly = mode === 'read';
  const stringValue = typeof value === 'string' ? value : value?.toString() || '';

  // textarea 높이 자동 조정 함수
  const adjustHeight = () => {
    if (textarea && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // value 변경 시 높이 조정
  useEffect(() => {
    adjustHeight();
  }, [textarea, stringValue]);

  // 포커스 처리
  useEffect(() => {
    if (mode === 'write') {
      (textarea ? textareaRef.current : inputRef.current)?.focus();
    }
  }, [mode, textarea]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e);
    requestAnimationFrame(adjustHeight);
  };

  const commonClassName = `w-full py-1 text-gray-base text-body outline-none transition-colors 
    ${type === 'date' ? 'date-input' : ''}
    ${isReadOnly ? 'bg-white cursor-default' : 'bg-light-gray-outline'}
  `;

  return (
    <div
      className={`flex-row input-common p-2.5 ${isReadOnly ? '!bg-white' : ''} transition-colors ${
        textarea ? '!h-auto' : ''
      }`}
    >
      {textarea ? (
        <textarea
          ref={textareaRef}
          id={id}
          placeholder={placeholder}
          value={stringValue}
          onChange={handleTextareaChange}
          name={name}
          required={required}
          readOnly={isReadOnly}
          className={commonClassName}
          rows={4}
          style={{ resize: 'none', overflow: 'hidden' }}
        />
      ) : (
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
          className={commonClassName}
        />
      )}
    </div>
  );
};

export default Inputs;
