"use client"

import React from 'react'
import { useInputList } from '@/utils/hook/useInputList'
import Inputs from './Inputs'

// 프레젠테이션 컴포넌트
const InputListProvider = () => {
  const [{ inputs, activeIndex }, dispatch] = useInputList()

  return (
    <div className='flex-col gap-2 items-start'>
      {inputs.map((input, index) => {
        const isLocked = activeIndex !== null && activeIndex !== index
        
        return (
          <div 
            key={index} 
            className='w-full' 
            onClick={() => dispatch({ type: 'SET_ACTIVE', index })}
          >
            <Inputs 
              {...input}
              type={isLocked ? "lock" : input.type || "text"}
              onChange={(e) => dispatch({ 
                type: 'UPDATE_VALUE', 
                index, 
                value: e.target.value 
              })}
            />
          </div>
        )
      })}
      
      <button 
        className="text-label text-gray-500" 
        onClick={() => dispatch({ type: 'ADD_INPUT' })}
      >
        + 추가하기
      </button>
    </div>
  )
}

export default InputListProvider
