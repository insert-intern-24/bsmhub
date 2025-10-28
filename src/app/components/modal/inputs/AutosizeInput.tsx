'use client';

import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

interface AutosizeInputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onCompositionStart?: () => void;
  onCompositionEnd?: () => void;
  autoFocus?: boolean;
  className?: string;
  inputRef?: (ref: HTMLInputElement | null) => void;
}

const AutosizeInput = forwardRef<HTMLInputElement, AutosizeInputProps>(
  ({ 
    type = 'text',
    placeholder = '',
    value = '',
    onChange,
    onKeyDown,
    onCompositionStart,
    onCompositionEnd,
    autoFocus = false,
    className = '',
    inputRef,
    ...props 
  }, ref) => {
    const inputRefInternal = useRef<HTMLInputElement>(null);
    const measureRef = useRef<HTMLSpanElement>(null);

    // ref를 외부로 노출
    useImperativeHandle(ref, () => inputRefInternal.current!);

    // inputRef 콜백 처리
    useEffect(() => {
      if (inputRef) {
        inputRef(inputRefInternal.current);
      }
    }, [inputRef]);

    // 자동 포커스 처리
    useEffect(() => {
      if (autoFocus && inputRefInternal.current) {
        inputRefInternal.current.focus();
      }
    }, [autoFocus]);

    // 크기 자동 조정
    useEffect(() => {
      if (measureRef.current && inputRefInternal.current) {
        const measureElement = measureRef.current;
        const inputElement = inputRefInternal.current;
        
        // 측정용 요소에 현재 값을 설정
        measureElement.textContent = value || placeholder;
        
        // 입력 요소의 폰트 스타일을 측정 요소에 복사
        const computedStyle = window.getComputedStyle(inputElement);
        measureElement.style.fontSize = computedStyle.fontSize;
        measureElement.style.fontFamily = computedStyle.fontFamily;
        measureElement.style.fontWeight = computedStyle.fontWeight;
        measureElement.style.letterSpacing = computedStyle.letterSpacing;
        measureElement.style.padding = computedStyle.padding;
        measureElement.style.border = computedStyle.border;
        
        // 최소 너비 설정 (placeholder가 보이도록)
        const minWidth = placeholder ? measureElement.offsetWidth : 0;
        const currentWidth = Math.max(minWidth, measureElement.offsetWidth);
        
        // 입력 요소 너비 조정
        inputElement.style.width = `${currentWidth + 2}px`; // 여백 추가
      }
    }, [value, placeholder]);

    return (
      <>
        {/* 측정용 숨겨진 요소 */}
        <span
          ref={measureRef}
          style={{
            position: 'absolute',
            visibility: 'hidden',
            whiteSpace: 'pre',
            top: '-9999px',
            left: '-9999px',
          }}
          aria-hidden="true"
        />
        
        {/* 실제 입력 요소 */}
        <input
          ref={inputRefInternal}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onCompositionStart={onCompositionStart}
          onCompositionEnd={onCompositionEnd}
          className={className}
          style={{
            minWidth: '20px',
            maxWidth: '100%',
          }}
          {...props}
        />
      </>
    );
  }
);

AutosizeInput.displayName = 'AutosizeInput';

export default AutosizeInput;