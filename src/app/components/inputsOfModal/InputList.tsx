"use client"

import React from 'react'
import { useInputList, MultiInputItem } from '@/utils/hook/useInputList'
import MultiInput from './MultiInput'
import { InputType } from './types/inputTypes'

// Input 설정 타입 - inputs 배열로 통일
export type InputConfig = {
  inputs: Array<{ 
    type?: InputType
    width?: number
    placeholder?: string
    name?: string
    required?: boolean
  }>
}

interface InputListProviderProps {
  config: InputConfig
  className?: string
  onInputsChange?: (inputs: MultiInputItem[][]) => void
  // maxInputs?: number
  showAddButton?: boolean
}

// 프레젠테이션 컴포넌트
const InputListProvider = ({ 
  config,
  className = '',
  onInputsChange,
  // maxInputs,
  showAddButton = true
}: InputListProviderProps) => {
  // config를 MultiInputItem으로 변환
  const initialConfig = config.inputs.map(input => ({
    type: input.type || 'text',
    width: input.width,
    placeholder: input.placeholder,
    name: input.name,
    required: input.required,
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
      {inputs.map((input, index) => {
        const isLocked = activeIndex !== null && activeIndex !== index
        
        return (
          <div 
            key={index} 
            className='w-full' 
            onClick={() => dispatch({ type: 'SET_ACTIVE', index })}
          >
            <MultiInput 
              config={input.map((item, subIndex) => ({
                ...item,
                type: isLocked ? "lock" : item.type || "text",
                onChange: (e) => dispatch({
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
      
      {showAddButton && (
        <button 
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
