import { useReducer } from 'react'
import { produce } from 'immer'
import { BaseInputProps } from '@/app/components/inputsOfModal/types/inputTypes'

// 상태 관리를 위한 타입 정의
interface InputListState {
  inputs: BaseInputProps[]
  activeIndex: number | null
}

type InputAction =
  | { type: 'UPDATE_VALUE'; index: number; value: string }
  | { type: 'SET_ACTIVE'; index: number }
  | { type: 'ADD_INPUT' }

// 커스텀 훅: 비즈니스 로직 분리
export const useInputList = () => {
  const isEmpty = (value?: string | number | null) => 
    !value || String(value).trim() === ''

  const reducer = produce((draft: InputListState, action: InputAction) => {
    switch (action.type) {
      case 'UPDATE_VALUE':
        draft.inputs[action.index].value = action.value
        break
      
      case 'SET_ACTIVE': {
        if (draft.activeIndex === action.index) return
        
        const shouldRemoveEmpty = draft.activeIndex !== null && 
          isEmpty(draft.inputs[draft.activeIndex]?.value)
        
        if (shouldRemoveEmpty) {
          const removedIndex = draft.activeIndex!
          draft.inputs.splice(removedIndex, 1)
        }
        draft.activeIndex = action.index % draft.inputs.length
        break
      }
      
      case 'ADD_INPUT': {
        const shouldRemoveEmpty = draft.activeIndex !== null && 
          isEmpty(draft.inputs[draft.activeIndex]?.value)
        
        if (shouldRemoveEmpty) {
          draft.inputs.splice(draft.activeIndex!, 1)
        }
        
        draft.inputs.push({ value: '' } as BaseInputProps)
        draft.activeIndex = draft.inputs.length - 1
        break
      }
    }
  })

  return useReducer(reducer, {
    inputs: [{ value: '' } as BaseInputProps],
    activeIndex: null
  })
}
