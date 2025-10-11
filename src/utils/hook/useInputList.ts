import { useReducer } from 'react'
import { produce } from 'immer'
import type { MultiInputItem } from '@/app/components/modal/inputs/MultiInput'

// MultiInputItem은 MultiInput.tsx에서 import하여 재export
export type { MultiInputItem }

// 상태 관리를 위한 타입 정의 - 모든 input을 MultiInputItem 배열로 통일
interface InputListState {
  inputs: MultiInputItem[][]
  activeIndex: number | null
}

type InputAction =
  | { type: 'UPDATE_VALUE'; index: number; value: string; subIndex: number }
  | { type: 'SET_ACTIVE'; index: number }
  | { type: 'ADD_INPUT'; multiInputConfig: MultiInputItem[] }

// 커스텀 훅: 비즈니스 로직 분리
export const useInputList = (initialConfig?: MultiInputItem[]) => {
  const isEmpty = (value?: string | number | null) => 
    !value || String(value).trim() === ''

  const isInputEmpty = (input: MultiInputItem[]): boolean => {
    // 모든 입력이 비어있는지 확인
    return input.every(item => isEmpty(item.value))
  }

  const reducer = produce((draft: InputListState, action: InputAction) => {
    switch (action.type) {
      case 'UPDATE_VALUE': {
        const input = draft.inputs[action.index]
        input[action.subIndex].value = action.value
        break
      }
      
      case 'SET_ACTIVE': {
        if (draft.activeIndex === action.index) return
        
        const shouldRemoveEmpty = draft.activeIndex !== null && 
          isInputEmpty(draft.inputs[draft.activeIndex])
        
        if (shouldRemoveEmpty) {
          const removedIndex = draft.activeIndex!
          draft.inputs.splice(removedIndex, 1)
        }
        draft.activeIndex = action.index % draft.inputs.length
        break
      }
      
      case 'ADD_INPUT': {
        const shouldRemoveEmpty = draft.activeIndex !== null && 
          isInputEmpty(draft.inputs[draft.activeIndex])
        
        if (shouldRemoveEmpty) {
          draft.inputs.splice(draft.activeIndex!, 1)
        }
        
        draft.inputs.push(action.multiInputConfig)
        draft.activeIndex = draft.inputs.length - 1
        break
      }
    }
  })

  const initialInputs = initialConfig || [{ value: '' } as MultiInputItem]

  return useReducer(reducer, {
    inputs: [initialInputs],
    activeIndex: null
  })
}
