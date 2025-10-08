'use client';

import { IconX } from "@tabler/icons-react";
import { useRef, useEffect } from "react";
import AutosizeInput from 'react-input-autosize';
import './common/common.css';

type WriteProps = {
  mode: 'write';
  value?: string;
  onChange?: (value: string) => void;
  onAdd?: () => void;
  white?: boolean;
  autoFocus?: boolean;
}

type EditProps = {
  mode: 'edit';
  value: string;
  onChange?: (value: string) => void;
  onDelete?: () => void;
  white?: boolean;
}

type ReadProps = {
  mode: 'read';
  value: string;
  white?: boolean;
}

type SkillTagProps = WriteProps | EditProps | ReadProps;

const SkillTag = (props: SkillTagProps) => {
  const { mode, white = false } = props;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isComposingRef = useRef(false);
  
  useEffect(() => {
    if (mode === 'write' && 'autoFocus' in props && props.autoFocus) {
      inputRef.current?.focus();
    }
  }, [mode, props]);
  
  const bgClass = white ? 'bg-white' : 'bg-light-gray-input';
  const tagClass = `px-3 py-1 rounded-full text-label ${bgClass}`;
  const inputClass = `remove-input-focus ${tagClass} placeholder-placeholder-gray`;
  
  // Write mode: 새로운 태그 작성
  if (mode === 'write') {
    const { value = '', onChange, onAdd } = props;
    
    return (
      <AutosizeInput
        inputRef={(ref) => { inputRef.current = ref; }}
        type='text'
        placeholder='입력해 추가하기...'
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onCompositionStart={() => isComposingRef.current = true}
        onCompositionEnd={() => isComposingRef.current = false}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !isComposingRef.current && value.trim()) {
            e.preventDefault();
            onAdd?.();
          }
        }}
        inputClassName={inputClass}
      />
    );
  }
  
  // Edit mode: 기존 태그 수정 (삭제 가능)
  if (mode === 'edit') {
    const { value, onChange, onDelete } = props;
    
    return (
      <div className={`flex-center gap-1 ${tagClass}`}>
        <AutosizeInput
          type='text'
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          inputClassName={`remove-input-focus ${bgClass}`}
        />
        {onDelete && (
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="flex-center hover:opacity-70 transition-opacity"
          >
            <IconX width={10} height={10} />
          </button>
        )}
      </div>
    );
  }

  // Read mode: 읽기 전용 (수정/삭제 불가)
  const { value } = props;
  
  return (
    <div className={tagClass}>
      <span>{value}</span>
    </div>
  );
};

export default SkillTag;