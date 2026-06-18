 import { useReducer } from 'react'
import { produce } from 'immer'
import type { MultiInputItem } from '@/app/components/ui/input/MultiInput'

// MultiInputItem은 MultiInput.tsx에서 import하여 재export
export type { MultiInputItem }

// 상태 관리를 위한 타입 정의 - 모든 input을 MultiInputItem 배열로 통일
interface InputListState {
  inputs: MultiInputItem[][]
  activeIndex: number | null
}

type InputAction =
  | { type: 'UPDATE_VALUE'; index: number; value: string | number | undefined; subIndex: number }
  | { type: 'SET_ACTIVE'; index: number | null }
  | { type: 'ADD_INPUT'; multiInputConfig: MultiInputItem[] }
  | { type: 'DELETE_INPUT'; index: number }

// 커스텀 훅: 비즈니스 로직 분리
export const useInputList = (initialConfig?: MultiInputItem[] | MultiInputItem[][]) => {
  const isEmpty = (value?: string | number | null) => 
    !value || String(value).trim() === ''

  const isInputEmpty = (input: MultiInputItem[]): boolean => {
    // 모든 입력이 비어있는지 확인
    return input && input.every(item => isEmpty(item.value))
  }

  const reducer = produce((draft: InputListState, action: InputAction) => {
    switch (action.type) {
      case 'UPDATE_VALUE': {
        if (draft.inputs[action.index]) {
          const input = draft.inputs[action.index]
          input[action.subIndex].value = action.value
        }
        break
      }
      
      case 'SET_ACTIVE': {
        if (draft.activeIndex === action.index) return
        
        // 새로운 activeIndex를 계산하기 위한 변수
        let newActiveIndex = action.index
        
        // activeIndex가 null이 아닐 때: 현재 활성화된 인풋이 비어있으면 제거
        if (draft.activeIndex !== null) {
          const shouldRemoveEmpty = isInputEmpty(draft.inputs[draft.activeIndex])
        if (shouldRemoveEmpty) {
          const removedIndex = draft.activeIndex!
          draft.inputs.splice(removedIndex, 1)
            if (newActiveIndex != null && newActiveIndex > removedIndex) {
              newActiveIndex--
            }
          }
        }
        
        // activeIndex가 null일 때: 클릭된 인덱스가 아닌 다른 빈 인풋들 제거
        // 0번 인풋이 비어있을 때 다른 인풋을 클릭하면 0번 인풋이 제거되어야 함
        if (draft.activeIndex === null && newActiveIndex !== null) {
          // 역순으로 순회하여 인덱스 변경에 영향 없이 제거
          for (let i = draft.inputs.length - 1; i >= 0; i--) {
            if (i !== newActiveIndex && isInputEmpty(draft.inputs[i])) {
              draft.inputs.splice(i, 1)
              if (newActiveIndex > i) {
                newActiveIndex--
          }
        }
          }
        }
        
        draft.activeIndex = newActiveIndex
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
      
      case 'DELETE_INPUT': {
        if (action.index >= 0 && action.index < draft.inputs.length) {
          draft.inputs.splice(action.index, 1)
          if (draft.activeIndex === action.index) {
            draft.activeIndex = null
          } else if (draft.activeIndex !== null && draft.activeIndex > action.index) {
            draft.activeIndex -= 1
          }
        }
        break
      }
    }
  })

  // initialConfig가 2차원 배열인지 확인
  const is2DArray = Array.isArray(initialConfig) && 
    initialConfig.length > 0 && 
    Array.isArray(initialConfig[0])

  const initialInputs = is2DArray 
    ? initialConfig as MultiInputItem[][]
    : initialConfig && initialConfig.length > 0
      ? [initialConfig as MultiInputItem[]]
      : [[{ value: '' } as MultiInputItem]]

  // console.log('useInputList initialInputs:', initialInputs);

  return useReducer(reducer, {
    inputs: initialInputs,
    activeIndex: null
  })
}