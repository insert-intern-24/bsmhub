# InputListProvider 개발자 문서

## 개요

`InputListProvider`는 동적으로 입력 필드를 추가/관리할 수 있는 React 컴포넌트입니다. 여러 개의 입력 그룹을 관리하며, 각 그룹은 하나 이상의 입력 필드를 포함할 수 있습니다.

## 주요 기능

- 🔄 **동적 입력 추가/제거**: 사용자가 필요에 따라 입력 그룹을 추가하거나 제거할 수 있습니다
- 🎯 **활성 상태 관리**: 한 번에 하나의 입력 그룹만 활성화되며, 비어있는 그룹은 자동으로 제거됩니다
- 🔒 **입력 잠금**: 비활성 입력 그룹은 잠금 상태로 표시되어 실수로 수정하는 것을 방지합니다
- 📊 **유연한 설정**: 각 입력 필드의 타입, 너비, placeholder 등을 세밀하게 제어할 수 있습니다

## 설치 및 의존성

```typescript
import InputListProvider from '@/app/components/inputsOfModal/InputListProvider'
```

### 필요한 의존성
- React (Client Component)
- `useInputList` hook
- `MultiInput` component
- `immer` (상태 불변성 관리)

## Props

### InputListProviderProps

| Prop | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `config` | `InputConfig` | ✅ | - | 입력 필드 설정 |
| `className` | `string` | ❌ | `''` | 컨테이너 추가 CSS 클래스 |
| `onInputsChange` | `(inputs: MultiInputItem[][]) => void` | ❌ | - | 입력값 변경 시 호출되는 콜백 |
| `onlyOne` | `boolean` | ❌ | `false` | 단일 입력만 허용 여부 (true일 경우 추가 버튼 숨김) |

### InputConfig

```typescript
type InputConfig = {
  inputs: Array<{ 
    type?: InputType          // 입력 필드 타입
    width?: number            // 너비 (퍼센트)
    placeholder?: string      // placeholder 텍스트
    name?: string            // 필드 이름
    required?: boolean       // 필수 입력 여부
  }>
  onlyOne?: boolean          // 단일 입력만 허용 여부
}
```

### InputType

```typescript
type InputType = 'text' | 'number' | 'date' | 'lock' | 'select' | ...
```

## 사용 예제

### 기본 사용법

```tsx
import InputListProvider from '@/app/components/inputsOfModal/InputListProvider'

function MyComponent() {
  const config = {
    inputs: [
      {
        type: 'text',
        placeholder: '이름을 입력하세요',
        width: 100,
        required: true
      }
    ]
  }

  return (
    <InputListProvider 
      config={config}
    />
  )
}
```

### 다중 입력 필드

```tsx
const config = {
  inputs: [
    {
      type: 'text',
      placeholder: '프로젝트명',
      width: 60,
      required: true
    },
    {
      type: 'date',
      placeholder: '시작일',
      width: 40
    }
  ]
}

<InputListProvider config={config} />
```

### 입력값 변경 감지

```tsx
function MyForm() {
  const handleInputsChange = (inputs: MultiInputItem[][]) => {
    console.log('Current inputs:', inputs)
    // 입력값을 상태에 저장하거나 처리
  }

  return (
    <InputListProvider 
      config={config}
      onInputsChange={handleInputsChange}
    />
  )
}
```

### 단일 입력만 허용

추가 버튼을 숨기고 단일 입력만 허용하려면 `onlyOne`을 사용합니다:

```tsx
<InputListProvider 
  config={{
    inputs: [
      { type: 'text', placeholder: '이메일을 입력하세요' }
    ],
    onlyOne: true  // 추가 버튼 숨김
  }}
/>
```

## 내부 동작 원리

### 상태 관리 (`useInputList` hook)

컴포넌트는 `useInputList` 커스텀 훅을 사용하여 상태를 관리합니다:

```typescript
interface InputListState {
  inputs: MultiInputItem[][]  // 입력 그룹 배열
  activeIndex: number | null  // 현재 활성화된 그룹 인덱스
}
```

### 주요 액션

#### 1. UPDATE_VALUE
입력 필드의 값을 업데이트합니다.

```typescript
dispatch({
  type: 'UPDATE_VALUE',
  index: 0,        // 그룹 인덱스
  subIndex: 0,     // 필드 인덱스
  value: '새 값'
})
```

#### 2. SET_ACTIVE
특정 입력 그룹을 활성화합니다. 이전에 활성화된 그룹이 비어있으면 자동으로 제거됩니다.

```typescript
dispatch({
  type: 'SET_ACTIVE',
  index: 1
})
```

#### 3. ADD_INPUT
새로운 입력 그룹을 추가합니다.

```typescript
dispatch({
  type: 'ADD_INPUT',
  multiInputConfig: initialConfig
})
```

### 자동 제거 로직

비어있는 입력 그룹은 다음 상황에서 자동으로 제거됩니다:
- 다른 입력 그룹을 클릭할 때
- 새로운 입력 그룹을 추가할 때

```typescript
const isInputEmpty = (input: MultiInputItem[]): boolean => {
  return input.every(item => isEmpty(item.value))
}
```

## 스타일링

기본 구조:

```tsx
<div className="flex-col gap-2 items-start">
  {/* 입력 그룹들 */}
  <div className="w-full">
    <MultiInput config={...} />
  </div>
  
  {/* 추가 버튼 */}
  <button className="text-label text-gray-500">
    + 추가하기
  </button>
</div>
```

커스텀 스타일 추가:

```tsx
<InputListProvider 
  config={config}
  className="my-custom-class p-4 bg-white"
/>
```

## 고급 사용 사례

### 폼 데이터 수집

```tsx
function ProjectForm() {
  const [projects, setProjects] = useState<MultiInputItem[][]>([])

  const config = {
    inputs: [
      { type: 'text', placeholder: '프로젝트명', width: 50 },
      { type: 'text', placeholder: '역할', width: 50 }
    ]
  }

  const handleSubmit = () => {
    const formattedData = projects.map(project => ({
      name: project[0].value,
      role: project[1].value
    }))
    
    // API 호출 등...
  }

  return (
    <>
      <InputListProvider 
        config={config}
        onInputsChange={setProjects}
      />
      <button onClick={handleSubmit}>제출</button>
    </>
  )
}
```

### 조건부 입력 필드

```tsx
const config = {
  inputs: selectedType === 'project' 
    ? [
        { type: 'text', placeholder: '프로젝트명' },
        { type: 'date', placeholder: '기간' }
      ]
    : [
        { type: 'text', placeholder: '활동명' },
        { type: 'text', placeholder: '내용' }
      ]
}
```

## 제한사항 및 주의사항

1. **Client Component**: `"use client"` 지시문이 필요합니다
2. **빈 값 처리**: 모든 필드가 비어있는 그룹은 자동으로 제거됩니다
3. **단일 활성화**: 한 번에 하나의 입력 그룹만 활성 상태일 수 있습니다
4. **초기값**: 컴포넌트는 항상 하나의 빈 입력 그룹으로 시작합니다

## 디버깅 팁

### 입력값 확인

```tsx
<InputListProvider 
  config={config}
  onInputsChange={(inputs) => {
    console.log('Current state:', JSON.stringify(inputs, null, 2))
  }}
/>
```

### 활성 인덱스 추적

```typescript
const [{ inputs, activeIndex }, dispatch] = useInputList(initialConfig)

console.log('Active index:', activeIndex)
console.log('Total groups:', inputs.length)
```

## 관련 컴포넌트

- `MultiInput`: 단일 입력 그룹을 렌더링하는 컴포넌트
- `useInputList`: 상태 관리를 위한 커스텀 훅
- Input 타입 컴포넌트들: `SingleInput`, `PictureUpload` 등

## 버전 히스토리

- v1.0.0: 초기 릴리스
  - 기본 입력 추가/제거 기능
  - 활성 상태 관리
  - 자동 빈 값 제거

## 라이센스

프로젝트 라이센스를 따릅니다.
