# InputOfModal 개발자 문서

## 개요

`InputOfModal`은 설정(config) 기반으로 폼을 자동 생성하는 React 컴포넌트입니다. Label과 InputListProvider를 쌍으로 관리하며, React Hook Form이 내장되어 있어 폼 검증과 상태 관리를 자동으로 처리합니다.

## 주요 기능

- 📝 **Config 기반 폼 생성**: JSON 형태의 설정으로 폼 자동 생성
- ✅ **내장 검증**: 필수 필드 자동 검증 및 에러 메시지 표시
- 🎨 **일관된 UI**: Label, Input, Error 메시지가 자동으로 배치
- 🔄 **React Hook Form 통합**: 폼 상태 관리 및 검증 내장
- 🎯 **타입 안전**: TypeScript 타입 지원

## 설치 및 의존성

```typescript
import InputOfModal from '@/app/components/inputsOfModal/InputOfModal'
import { FormConfig } from '@/app/components/inputsOfModal/types/inputTypes'
```

### 필요한 의존성
- React (Client Component)
- react-hook-form
- InputListProvider
- LabelOfInputs
- Buttons

## Props

### InputOfModalProps

| Prop | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `title` | `string` | ❌ | `'입력 필드'` | 폼 제목 |
| `config` | `FormConfig` | ✅ | - | 폼 필드 설정 |
| `onSubmit` | `(data: Record<string, MultiInputItem[][]>) => void` | ❌ | - | 폼 제출 시 호출되는 콜백 |

## 타입 정의

### FormConfig

```typescript
interface FormConfig {
  fields: FormFieldConfig[]
}
```

### FormFieldConfig

```typescript
interface FormFieldConfig {
  label: string              // 필드 라벨 텍스트
  required?: boolean         // 필수 입력 여부
  fieldName: string          // React Hook Form의 필드명 (고유해야 함)
  inputConfig: InputConfig   // InputListProvider의 설정
}
```

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

## 사용 예제

### 기본 사용법

```tsx
'use client'

import InputOfModal from '@/app/components/inputsOfModal/InputOfModal'
import { FormConfig } from '@/app/components/inputsOfModal/types/inputTypes'

const formConfig: FormConfig = {
  fields: [
    {
      label: "이메일",
      required: true,
      fieldName: "email",
      inputConfig: {
        inputs: [
          { type: 'text', placeholder: '이메일을 입력하세요' }
        ],
        onlyOne: true
      }
    }
  ]
}

export default function MyPage() {
  return <InputOfModal config={formConfig} />
}
```

### 제출 핸들러 추가

```tsx
export default function MyPage() {
  const handleSubmit = (data) => {
    console.log('제출된 데이터:', data)
    // data 구조:
    // {
    //   email: [[{ type: 'text', value: 'user@example.com', ... }]],
    //   careers: [[...], [...]],
    //   ...
    // }
  }

  return (
    <InputOfModal 
      config={formConfig}
      onSubmit={handleSubmit}
    />
  )
}
```

### 커스텀 제목

```tsx
<InputOfModal 
  title="프로필 작성"
  config={formConfig}
  onSubmit={handleSubmit}
/>
```

### 복잡한 폼 설정

```tsx
const complexFormConfig: FormConfig = {
  fields: [
    {
      label: "이메일",
      required: true,
      fieldName: "email",
      inputConfig: {
        inputs: [
          { type: 'text', placeholder: '이메일을 입력하세요' }
        ],
        onlyOne: true  // 단일 입력만
      }
    },
    {
      label: "경력 사항",
      required: false,
      fieldName: "careers",
      inputConfig: {
        inputs: [
          { type: 'date', width: 30, placeholder: '시작일' },
          { type: 'text', width: 35, placeholder: '회사명' },
          { type: 'text', width: 35, placeholder: '직무' }
        ],
        onlyOne: false  // 여러 개 추가 가능
      }
    },
    {
      label: "수상 경력",
      required: false,
      fieldName: "awards",
      inputConfig: {
        inputs: [
          { type: 'date', width: 30, placeholder: '수상일' },
          { type: 'text', width: 70, placeholder: '수상 내용' }
        ]
      }
    },
    {
      label: "기술 스택",
      required: true,
      fieldName: "skills",
      inputConfig: {
        inputs: [
          { type: 'text', placeholder: '기술명 입력' }
        ]
      }
    }
  ]
}

export default function ProfileForm() {
  const handleSubmit = async (data) => {
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (response.ok) {
        alert('프로필이 저장되었습니다!')
      }
    } catch (error) {
      console.error('저장 실패:', error)
    }
  }

  return (
    <InputOfModal 
      title="프로필 작성"
      config={complexFormConfig}
      onSubmit={handleSubmit}
    />
  )
}
```

## 내부 동작 원리

### 1. 폼 초기화

React Hook Form의 `useForm`을 사용하여 폼을 초기화합니다:

```typescript
const { control, handleSubmit, formState: { errors } } = useForm({
  defaultValues: config.fields.reduce((acc, field) => {
    acc[field.fieldName] = []
    return acc
  }, {} as Record<string, MultiInputItem[][]>)
})
```

### 2. 필드 렌더링

각 필드는 `Controller`로 감싸져서 React Hook Form과 연동됩니다:

```tsx
<Controller
  name={field.fieldName}
  control={control}
  rules={{ 
    validate: (value) => {
      if (field.required && (!value || value.length === 0)) {
        return `${field.label}은(는) 필수 항목입니다.`
      }
      return true
    }
  }}
  render={({ field: { onChange } }) => (
    <InputListProvider
      config={field.inputConfig}
      onInputsChange={onChange}
      onlyOne={field.inputConfig.onlyOne}
    />
  )}
/>
```

### 3. 검증

필수 필드는 자동으로 검증됩니다:
- 필드가 비어있는지 확인
- 에러 메시지 자동 생성 및 표시

### 4. 제출

제출 버튼은 `Buttons` 컴포넌트를 사용하며, 클릭 시 검증 후 `onSubmit` 콜백 호출:

```tsx
<Buttons 
  color="black"
  text="제출"
  onClick={handleSubmit(onFormSubmit)}
/>
```

## 데이터 구조

### 제출 시 데이터 형식

```typescript
{
  [fieldName: string]: MultiInputItem[][]
}

// 예시:
{
  email: [
    [{ type: 'text', value: 'user@example.com', placeholder: '...', ... }]
  ],
  careers: [
    [
      { type: 'date', value: '2020-01-01', ... },
      { type: 'text', value: '회사A', ... },
      { type: 'text', value: '개발자', ... }
    ],
    [
      { type: 'date', value: '2022-06-01', ... },
      { type: 'text', value: '회사B', ... },
      { type: 'text', value: '시니어 개발자', ... }
    ]
  ]
}
```

## 스타일링

기본 구조:

```tsx
<form className="flex flex-col items-start w-[64rem] p-[4rem] gap-6">
  <Title>{title}</Title>
  
  {/* 각 필드 */}
  <div className="w-full flex flex-col gap-2">
    <LabelOfInputs label="..." required={...} />
    <InputListProvider ... />
    {errors && <span className="text-red-500 text-sm">...</span>}
  </div>
  
  {/* 제출 버튼 */}
  <div className="w-full mt-4">
    <Buttons ... />
  </div>
</form>
```

## 장단점

### 장점

✅ **빠른 개발**: Config만 작성하면 폼 완성  
✅ **일관성**: 모든 폼이 동일한 UI/UX  
✅ **유지보수 용이**: 중앙화된 검증 로직  
✅ **타입 안전**: TypeScript 지원  
✅ **자동 검증**: 필수 필드 자동 체크  

### 단점

❌ **커스터마이징 제한**: 복잡한 커스터마이징 어려움  
❌ **학습 곡선**: Config 구조 이해 필요  
❌ **오버엔지니어링 가능성**: 간단한 폼에는 과할 수 있음  

## 사용 시나리오

### 적합한 경우

- ✅ 반복적인 폼 구조가 많은 프로젝트
- ✅ 일관된 폼 UI가 필요한 경우
- ✅ 빠른 프로토타이핑
- ✅ 동적으로 폼을 생성해야 하는 경우

### 부적합한 경우

- ❌ 고도로 커스터마이즈된 폼이 필요한 경우
- ❌ 매우 간단한 폼 (오히려 복잡도 증가)
- ❌ 특수한 검증 로직이 많이 필요한 경우

## 확장 가능성

### 커스텀 검증 추가

현재는 필수 필드만 검증하지만, 확장 가능:

```typescript
// 향후 추가 가능한 기능
interface FormFieldConfig {
  label: string
  required?: boolean
  fieldName: string
  inputConfig: InputConfig
  validation?: {
    pattern?: RegExp
    minLength?: number
    maxLength?: number
    custom?: (value: any) => string | true
  }
}
```

### 커스텀 버튼

```typescript
interface InputOfModalProps {
  // ...
  submitButtonText?: string
  submitButtonColor?: 'black' | 'blue' | 'gray'
  showCancelButton?: boolean
  onCancel?: () => void
}
```

## 관련 문서

- [InputListProvider 문서](./InputListProvider.md)
- [React Hook Form 통합 가이드](./InputListProvider-with-ReactHookForm.md)
- [React Hook Form 공식 문서](https://react-hook-form.com/)

## 트러블슈팅

### 문제: 폼이 제출되지 않음

**원인**: 필수 필드가 비어있음  
**해결**: 브라우저 콘솔에서 검증 에러 확인

```tsx
const { control, handleSubmit, formState: { errors } } = useForm(...)

console.log('Validation errors:', errors)
```

### 문제: onSubmit이 호출되지 않음

**원인**: Client Component가 아님  
**해결**: 파일 상단에 `"use client"` 추가

```tsx
"use client"

export default function MyPage() {
  // ...
}
```

### 문제: 데이터 형식이 예상과 다름

**원인**: MultiInputItem[][] 구조 이해 부족  
**해결**: 콘솔에 데이터 출력하여 구조 확인

```tsx
const handleSubmit = (data) => {
  console.log('Data structure:', JSON.stringify(data, null, 2))
}
```

## 요약

- Config 기반으로 폼을 자동 생성하는 고수준 컴포넌트
- React Hook Form 내장으로 검증 및 상태 관리 자동화
- Label과 InputListProvider를 쌍으로 관리
- 반복적인 폼 작업에 적합
- 타입 안전하고 유지보수 용이
