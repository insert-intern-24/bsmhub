"use client"

import React from 'react'
import { useInputList } from '@utils/hook/useInputList'
import MultiInput, { type MultiInputItem } from './MultiInput'
import { InputType } from './types/inputTypes'

// Input 설정 타입 - inputs 배열로 통일
export type InputConfig = {
  inputs: Array<{ 
    type?: InputType
    width?: number
    placeholder?: string
    name?: string
    required?: boolean
    aspectRatio?: string
  }>
  onlyOne?: boolean
  white?: boolean // SkillTag용
  multiInputConfig?: Array<{ placeholder?: string }> // Checkbox용
}

interface InputListProviderProps {
  config: InputConfig
  className?: string
  onInputsChange?: (inputs: MultiInputItem[][]) => void
  // maxInputs?: number
  onlyOne?: boolean
}

// 프레젠테이션 컴포넌트
const InputListProvider = ({ 
  config,
  className = '',
  onInputsChange,
  // maxInputs,
  onlyOne = false
}: InputListProviderProps) => {
  // config를 MultiInputItem으로 변환
  const initialConfig = config.inputs.map(input => ({
    type: input.type || 'text',
    width: input.width,
    placeholder: input.placeholder,
    name: input.name,
    required: input.required,
    aspectRatio: input.aspectRatio,
    value: ''
  })) as MultiInputItem[]

  const [{ inputs, activeIndex }, dispatch] = useInputList(initialConfig)

  // inputs가 변경될 때마다 콜백 호출
  React.useEffect(() => {
    onInputsChange?.(inputs)
  }, [inputs, onInputsChange])

  const handleAddInput = () => {
    // maxInputs 체크
    // if (maxInputs && inputs.length >= maxInputs) {
    //   return
    // }

    dispatch({ 
      type: 'ADD_INPUT',
      multiInputConfig: initialConfig
    })
  }

  // const canAddMore = !maxInputs || inputs.length < maxInputs

  return (
    <div className={`flex-col gap-2 items-start ${className}`}>
      {inputs.map((input: MultiInputItem[], index: number) => {
        const isReadOnly = activeIndex !== null && activeIndex !== index
        
        return (
          <div 
            key={index} 
            className='w-full' 
            onClick={() => dispatch({ type: 'SET_ACTIVE', index })}
          >
            <MultiInput 
              config={input.map((item: MultiInputItem, subIndex: number) => ({
                ...item,
                readOnly: isReadOnly,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => dispatch({
                  type: 'UPDATE_VALUE',
                  index,
                  subIndex,
                  value: e.target.value
                })
              }))}
            />
          </div>
        )
      })}
      
      {!onlyOne && (
        <button 
          type="button"
          className="text-label text-gray-500" 
          onClick={handleAddInput}
        >
          + 추가하기
        </button>
      )}
    </div>
  )
}

export default InputListProvider
