'use client';

import React from 'react';
import { useInputList } from '@utils/hook/useInputList';
import SkillTag from './SkillTag';

interface SkillTagProviderProps {
  white?: boolean;
  className?: string;
  onTagsChange?: (tags: string[]) => void;
  readOnly?: boolean;
  initialTags?: string[]; // 초기 태그 값
}

const SkillTagProvider = ({ 
  white = false, 
  className = '',
  onTagsChange,
  readOnly = false,
  initialTags = []
}: SkillTagProviderProps) => {
  const [{ inputs, activeIndex }, dispatch] = useInputList([{ value: '' }]);
  
  // 초기 태그 설정
  React.useEffect(() => {
    if (initialTags.length > 0) {
      initialTags.forEach((tag, index) => {
        if (index === 0) {
          dispatch({ type: 'UPDATE_VALUE', index: 0, subIndex: 0, value: tag });
        } else {
          dispatch({ type: 'ADD_INPUT', multiInputConfig: [{ value: tag }] });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 태그 값 추출
  const getValue = (index: number) => String(inputs[index]?.[0]?.value || '');
  
  // 값 업데이트
  const updateValue = (index: number, value: string) => 
    dispatch({ type: 'UPDATE_VALUE', index, subIndex: 0, value });
  
  // 새 입력 추가
  const addInput = () => 
    dispatch({ type: 'ADD_INPUT', multiInputConfig: [{ value: '' }] });
  
  // 태그 삭제
  const deleteTag = (index: number) => {
    updateValue(index, '');
    
    // 현재 작성 중인 다른 태그가 있으면 그대로 유지
    if (activeIndex !== null && activeIndex !== index) {
      dispatch({ type: 'SET_ACTIVE', index: activeIndex });
      return;
    }
    
    // 다른 태그가 있으면 첫 번째로, 없으면 새로 추가
    const hasOtherTags = inputs.some((input, i) => i !== index && getValue(i).trim());
    if (hasOtherTags) {
      dispatch({ type: 'SET_ACTIVE', index: 0 });
    } else {
      addInput();
    }
  };

  // 태그 변경 콜백
  React.useEffect(() => {
    if (onTagsChange) {
      const tags = inputs.map((input) => String(input[0]?.value || '')).filter(v => v.trim());
      onTagsChange(tags);
    }
  }, [inputs, onTagsChange]);

  // 태그 렌더링
  const renderTag = (index: number) => {
    const value = getValue(index);
    const isActive = activeIndex === index;
    
    if (!value.trim() && !isActive) return null;
    if (readOnly) return <SkillTag key={index} mode="read" value={value} white={white} />;
    
    if (isActive) {
      return (
        <SkillTag
          key={index}
          mode="write"
          value={value}
          onChange={(val) => updateValue(index, val)}
          onAdd={() => value.trim() && addInput()}
          white={white}
          autoFocus
        />
      );
    }
    
    return (
      <div 
        key={index}
        onClick={() => dispatch({ type: 'SET_ACTIVE', index })}
        className="cursor-pointer"
      >
        <SkillTag
          mode="edit"
          value={value}
          onChange={(val) => updateValue(index, val)}
          onDelete={() => deleteTag(index)}
          white={white}
        />
      </div>
    );
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {inputs.map((_, index) => renderTag(index))}
      {!readOnly && (
        <button
          type="button"
          onClick={addInput}
          className={`px-3 py-1 rounded-full text-label text-placeholder-gray ${white ? 'bg-white' : 'bg-light-gray-input'} hover:opacity-70`}
        >
          + 추가하기
        </button>
      )}
    </div>
  );
};

export default SkillTagProvider;
