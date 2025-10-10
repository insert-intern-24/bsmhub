# SkillTag 개발자 문서

## 개요

`SkillTag`는 태그 형태로 여러 값을 입력하고 관리할 수 있는 React 컴포넌트입니다. 엔터키로 태그를 추가하고, X 버튼으로 삭제할 수 있으며, 한글 입력(IME)을 완벽하게 지원합니다.

## 주요 기능

- 🏷️ **태그 형식**: 시각적으로 구분되는 태그 UI
- ⌨️ **키보드 네비게이션**: 엔터로 추가, X 버튼으로 삭제
- 🌏 **한글 입력 지원**: IME Composition 이벤트 처리
- 📏 **자동 너비 조정**: react-input-autosize로 입력값에 따라 자동 조절
- 🎨 **세 가지 모드**: write/edit/read 모드 지원
- 🔒 **읽기 전용**: readOnly 모드로 수정 불가능한 태그 표시

## 설치 및 의존성

```typescript
import SkillTag from '@/app/components/modal/inputs/SkillTag'
import SkillTagProvider from '@/app/components/modal/inputs/SkillTagProvider'
```

### 필요한 의존성
- React (Client Component)
- react-input-autosize (3.0.0)
- @tabler/icons-react
- useInputList hook

### 라이브러리 설치

```bash
pnpm add react-input-autosize
pnpm add -D @types/react-input-autosize
```

## Props

### SkillTag Props

`SkillTag`는 **Discriminated Union** 타입을 사용합니다:

#### Write 모드 (새 태그 추가용)

```typescript
type WriteProps = {
  mode: 'write'
  value?: string
  onChange?: (value: string) => void
  onAdd?: () => void
  autoFocus?: boolean
}
```

| Prop | 타입 | 설명 |
|------|------|------|
| `mode` | `'write'` | Write 모드 지정 |
| `value` | `string` | 입력값 |
| `onChange` | `(value: string) => void` | 입력값 변경 핸들러 |
| `onAdd` | `() => void` | 엔터키 입력 시 호출 (태그 추가) |
| `autoFocus` | `boolean` | 자동 포커스 여부 |

#### Edit 모드 (기존 태그 수정용)

```typescript
type EditProps = {
  mode: 'edit'
  value: string
  onChange?: (value: string) => void
  onDelete?: () => void
}
```

| Prop | 타입 | 설명 |
|------|------|------|
| `mode` | `'edit'` | Edit 모드 지정 |
| `value` | `string` | 태그 텍스트 (필수) |
| `onChange` | `(value: string) => void` | 값 변경 핸들러 |
| `onDelete` | `() => void` | X 버튼 클릭 시 호출 (태그 삭제) |

#### Read 모드 (읽기 전용)

```typescript
type ReadProps = {
  mode: 'read'
  value: string
}
```

| Prop | 타입 | 설명 |
|------|------|------|
| `mode` | `'read'` | Read 모드 지정 |
| `value` | `string` | 태그 텍스트 (필수) |

### SkillTagProvider Props

```typescript
interface SkillTagProviderProps {
  onTagsChange?: (tags: string[]) => void
  white?: boolean
  readOnly?: boolean
  initialTags?: string[]
}
```

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `onTagsChange` | `(tags: string[]) => void` | - | 태그 배열 변경 시 호출되는 콜백 |
| `white` | `boolean` | `false` | 배경색 (true: 흰색, false: 회색) |
| `readOnly` | `boolean` | `false` | 읽기 전용 모드 여부 |
| `initialTags` | `string[]` | `[]` | 초기 태그 배열 |

## 사용 예제

### 기본 사용법 (SkillTagProvider)

```tsx
'use client'

import SkillTagProvider from '@/app/components/modal/inputs/SkillTagProvider'

export default function MyComponent() {
  const handleTagsChange = (tags: string[]) => {
    console.log('Current tags:', tags)
  }

  return (
    <SkillTagProvider 
      onTagsChange={handleTagsChange}
    />
  )
}
```

### 초기 태그 설정

```tsx
<SkillTagProvider 
  initialTags={['React', 'TypeScript', 'Next.js']}
  onTagsChange={handleTagsChange}
/>
```

### 읽기 전용 모드

```tsx
<SkillTagProvider 
  initialTags={['React', 'TypeScript']}
  readOnly={true}
  white={true}  // 흰색 배경
/>
```

### SkillTag 직접 사용 (고급)

대부분의 경우 `SkillTagProvider`를 사용하는 것이 권장되지만, 직접 `SkillTag`를 사용할 수도 있습니다:

#### Write 모드

```tsx
import SkillTag from '@/app/components/modal/inputs/SkillTag'

<SkillTag 
  mode="write"
  value={inputValue}
  onChange={setInputValue}
  onAdd={handleAddTag}
  autoFocus={true}
/>
```

#### Edit 모드

```tsx
<SkillTag 
  mode="edit"
  value="React"
  onChange={(newValue) => updateTag(index, newValue)}
  onDelete={() => deleteTag(index)}
/>
```

#### Read 모드

```tsx
<SkillTag 
  mode="read"
  value="TypeScript"
/>
```

## 내부 동작 원리

### 1. 한글 입력 (IME Composition) 처리

한글 입력 시 엔터키가 두 번 눌리는 문제를 방지하기 위해 composition 이벤트를 처리합니다:

```typescript
const isComposingRef = useRef(false)

// 한글 입력 시작
const handleCompositionStart = () => {
  isComposingRef.current = true
}

// 한글 입력 완료
const handleCompositionEnd = () => {
  isComposingRef.current = false
}

// 엔터키 처리
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' && !isComposingRef.current) {
    onAdd?.()  // 한글 입력 중이 아닐 때만 태그 추가
  }
}
```

### 2. 자동 너비 조정

`react-input-autosize` 라이브러리를 사용하여 입력값에 따라 너비를 자동으로 조정합니다:

```tsx
<AutosizeInput
  value={value}
  onChange={(e) => onChange?.(e.target.value)}
  placeholder="Enter로 추가"
  placeholderIsMinWidth  // placeholder 길이를 최소 너비로 사용
  className="input-common remove-input-focus"
/>
```

### 3. 이벤트 버블링 방지

X 버튼 클릭 시 이벤트가 부모로 전파되는 것을 방지합니다:

```tsx
<button
  onClick={(e) => {
    e.stopPropagation()  // 이벤트 버블링 방지
    onDelete?.()
  }}
>
  <IconX />
</button>
```

### 4. SkillTagProvider 상태 관리

`useInputList` 훅을 사용하여 태그 배열을 관리합니다:

```typescript
const [{ inputs, activeIndex }, dispatch] = useInputList(initialConfig)

// 값 가져오기
const getValue = (index: number): string => {
  return String(inputs[index]?.[0]?.value || '')
}

// 값 업데이트
const updateValue = (index: number, value: string) => {
  dispatch({ type: 'UPDATE_VALUE', index, subIndex: 0, value })
}

// 태그 추가
const addInput = () => {
  if (readOnly) return
  dispatch({ type: 'ADD_INPUT', multiInputConfig: initialConfig })
}

// 태그 삭제
const deleteTag = (index: number) => {
  if (readOnly) return
  
  // 다른 활성 태그가 있는지 확인
  const hasOtherActiveTags = inputs.some((input, i) => {
    if (i === index) return false
    return !isEmpty(getValue(i))
  })
  
  if (hasOtherActiveTags) {
    dispatch({ type: 'REMOVE_INPUT', index })
  } else {
    // 마지막 태그면 값만 지우기
    updateValue(index, '')
  }
}
```

## 스타일링

### CSS 클래스

공통 스타일은 `common.css`에 정의되어 있습니다:

```css
/* common.css */
.input-common {
  @apply px-4 py-2 rounded-md text-base;
}

.remove-input-focus {
  @apply outline-none border-none focus:outline-none focus:ring-0;
}
```

### 태그 스타일

```tsx
// Write/Edit 모드 - 회색 배경
<div className="bg-light-gray-outline rounded-md px-4 py-2">
  <AutosizeInput ... />
</div>

// Read 모드 - 회색 배경
<div className="bg-light-gray-outline rounded-md px-4 py-2">
  {value}
</div>

// 흰색 배경 (white prop 사용 시)
<div className="bg-white rounded-md px-4 py-2">
  ...
</div>
```

### 삭제 버튼

```tsx
<button className="ml-2 text-gray-400 hover:text-gray-600">
  <IconX size={16} />
</button>
```

## InputOfModal과 함께 사용

`SkillTag`는 `InputOfModal`과 통합되어 React Hook Form과 함께 사용할 수 있습니다:

```tsx
import InputOfModal from '@/app/components/modal/inputs/InputOfModal'
import { FormConfig } from '@/app/components/modal/inputs/types/inputTypes'

const formConfig: FormConfig = {
  fields: [
    {
      type: 'skillTag',
      label: '기술 스택',
      fieldName: 'skills',
      required: true,
      white: false,
      initialTags: ['React', 'TypeScript']
    }
  ]
}

export default function MyForm() {
  const handleSubmit = (data: any) => {
    console.log('Skills:', data.skills)  // ['React', 'TypeScript', ...]
  }

  return (
    <InputOfModal 
      config={formConfig}
      onSubmit={handleSubmit}
    />
  )
}
```

## 실전 사용 사례

### 기술 스택 입력

```tsx
'use client'

import SkillTagProvider from '@/app/components/modal/inputs/SkillTagProvider'
import { useState } from 'react'

export default function SkillsInput() {
  const [skills, setSkills] = useState<string[]>([])

  const handleSubmit = () => {
    console.log('Selected skills:', skills)
    // API 호출 등...
  }

  return (
    <div className="flex flex-col gap-4">
      <h2>보유 기술을 입력하세요</h2>
      <SkillTagProvider 
        onTagsChange={setSkills}
        initialTags={['JavaScript']}
      />
      <button onClick={handleSubmit}>
        제출
      </button>
    </div>
  )
}
```

### 읽기 전용 태그 표시

```tsx
export default function UserProfile({ user }) {
  return (
    <div>
      <h3>보유 기술</h3>
      <SkillTagProvider 
        initialTags={user.skills}
        readOnly={true}
        white={true}
      />
    </div>
  )
}
```

## 제한사항 및 주의사항

1. **Client Component**: `"use client"` 지시문이 필요합니다
2. **빈 태그 제거**: 빈 값의 태그는 자동으로 제거되지 않으며, 사용자가 직접 삭제해야 합니다
3. **중복 태그**: 중복된 태그를 자동으로 방지하지 않습니다 (필요시 커스텀 로직 추가)
4. **최대 개수 제한 없음**: 태그 개수 제한이 없습니다 (필요시 커스텀 로직 추가)

## 트러블슈팅

### 문제: 한글 입력 시 마지막 글자만 남는 문제

**원인**: IME Composition 이벤트가 처리되지 않음  
**해결**: 이미 구현되어 있으므로 최신 버전의 `SkillTag`를 사용

### 문제: X 버튼 클릭 시 태그가 삭제되지 않음

**원인**: 이벤트 버블링으로 인해 다른 핸들러가 먼저 실행됨  
**해결**: `e.stopPropagation()`이 이미 적용되어 있음

### 문제: 태그가 자동으로 추가되지 않음

**원인**: `onAdd` 핸들러가 전달되지 않음  
**해결**: `SkillTagProvider`를 사용하면 자동으로 처리됨

## 성능 최적화

### 메모이제이션

태그 개수가 많을 경우 `useMemo`로 최적화:

```tsx
const tagElements = useMemo(() => {
  return inputs.map((input, index) => (
    <SkillTag
      key={index}
      mode={/* ... */}
      value={getValue(index)}
      onChange={/* ... */}
      onDelete={/* ... */}
    />
  ))
}, [inputs, activeIndex, readOnly])
```

## 관련 컴포넌트

- **SkillTagProvider**: 태그 배열을 관리하는 고수준 컴포넌트 (권장)
- **SkillTag**: 개별 태그를 렌더링하는 저수준 컴포넌트
- **InputOfModal**: React Hook Form과 통합하여 폼으로 사용
- **useInputList**: 상태 관리 커스텀 훅

## 관련 문서

- [InputOfModal 문서](./InputOfModal.md)
- [InputListProvider 문서](./InputListProvider.md)
- [React Hook Form 통합 가이드](./InputListProvider-with-ReactHookForm.md)

## 버전 히스토리

- v1.0.0: 초기 릴리스
  - write/edit/read 세 가지 모드
  - 한글 입력 지원
  - 자동 너비 조정
  - SkillTagProvider 컴포넌트
  - 초기 태그 및 읽기 전용 모드 지원

## 라이센스

프로젝트 라이센스를 따릅니다.
