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
import InputOfModal from '@/app/components/modal/inputs/InputOfModal'
import { FormConfig } from '@/app/components/modal/inputs/types/inputTypes'
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

`FormFieldConfig`는 필드 타입에 따라 다른 구조를 가지는 **Discriminated Union**입니다:

```typescript
type FormFieldConfig = 
  | InputListFieldConfig 
  | SkillTagFieldConfig 
  | CheckboxFieldConfig
  | PictureFieldConfig

// InputListProvider 필드
interface InputListFieldConfig {
  type: 'inputList'
  label: string
  fieldName: string
  required?: boolean
  inputConfig: InputConfig  // InputListProvider의 설정
}

// SkillTag 필드
interface SkillTagFieldConfig {
  type: 'skillTag'
  label: string
  fieldName: string
  required?: boolean
  white?: boolean           // 흰색 배경 여부
}

// Checkbox 필드
interface CheckboxFieldConfig {
  type: 'checkbox'
  label: string
  fieldName: string
  checkboxLabel?: string    // 체크박스 옆 텍스트
}

// Picture 필드
interface PictureFieldConfig {
  type: 'picture'
  label: string
  fieldName: string
  required?: boolean
  aspectRatio?: string      // 비율 (예: '1:1', '16:9')
  multiple?: boolean        // 여러 이미지 업로드 가능 여부
}
```

### InputConfig

```typescript
type InputConfig = {
  inputs: Array<{ 
    type?: InputHTMLType      // 실제 HTML input type ('text', 'date', 'email' 등)
    componentType?: InputType // 컴포넌트 구분 ('picture' 등)
    mode?: InputMode          // 입력 모드 ('write', 'edit', 'read')
    width?: number            // 너비 (퍼센트)
    placeholder?: string      // placeholder 텍스트
    name?: string            // 필드 이름
    required?: boolean       // 필수 입력 여부
    aspectRatio?: string     // picture 타입의 비율
    icon?: 'check' | 'search' | 'calendar'  // 아이콘 타입
  }>
  onlyOne?: boolean          // 단일 입력만 허용 여부
}

// InputMode: 입력 상태
type InputMode = 'write' | 'edit' | 'read'

// InputHTMLType: 실제 HTML input type
type InputHTMLType = 'text' | 'date' | 'number' | 'email' | 'password' | 'tel' | 'url'
```

## 사용 예제

### 기본 사용법

```tsx
'use client'

import InputOfModal from '@/app/components/modal/inputs/InputOfModal'
import { FormConfig } from '@/app/components/modal/inputs/types/inputTypes'

const formConfig: FormConfig = {
  fields: [
    {
      type: 'inputList',
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
      type: 'inputList',
      label: "이메일",
      required: true,
      fieldName: "email",
      inputConfig: {
        inputs: [
          { type: 'email', placeholder: '이메일을 입력하세요', icon: 'check' }
        ],
        onlyOne: true  // 단일 입력만
      }
    },
    {
      type: 'inputList',
      label: "경력 사항",
      required: false,
      fieldName: "careers",
      inputConfig: {
        inputs: [
          { type: 'date', width: 30, placeholder: '시작일', icon: 'calendar' },
          { type: 'text', width: 35, placeholder: '회사명' },
          { type: 'text', width: 35, placeholder: '직무' }
        ],
        onlyOne: false  // 여러 개 추가 가능
      }
    },
    {
      type: 'picture',
      label: "프로필 사진",
      required: false,
      fieldName: "profilePicture",
      aspectRatio: '1:1'  // 정사각형
    },
    {
      type: 'skillTag',
      label: "기술 스택",
      required: true,
      fieldName: "skills",
      white: false  // 회색 배경
    },
    {
      type: 'checkbox',
      label: "포트폴리오 공개",
      fieldName: "isPublic",
      checkboxLabel: "포트폴리오를 공개합니다"
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

각 필드는 `Controller`로 감싸져서 React Hook Form과 연동됩니다. 필드 타입에 따라 다른 컴포넌트가 렌더링됩니다:

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
  render={({ field: { onChange, value } }) => {
    // SkillTag 필드
    if (field.type === 'skillTag') {
      return (
        <SkillTagProvider
          onTagsChange={(tags: string[]) => onChange(tags.map(tag => [{ value: tag }]))}
          white={field.white}
        />
      )
    }
    
    // Checkbox 필드
    if (field.type === 'checkbox') {
      return (
        <Checkbox
          checked={!!value}
          onChange={(checked: boolean) => onChange(checked)}
          label={field.checkboxLabel}
        />
      )
    }
    
    // Picture 필드
    if (field.type === 'picture') {
      return (
        <PictureUpload
          aspectRatio={field.aspectRatio}
          onFileChange={onChange}
          value={typeof value === 'string' ? value : undefined}
        />
      )
    }
    
    // InputList 필드
    if (field.type === 'inputList') {
      return (
        <InputListProvider
          config={field.inputConfig}
          onInputsChange={onChange}
          onlyOne={field.inputConfig.onlyOne}
        />
      )
    }
    
    return <></>
  }}
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

## 필드 타입별 상세 설명

### InputList 필드 (`type: 'inputList'`)

동적으로 입력 행을 추가/제거할 수 있는 필드입니다.

```tsx
{
  type: 'inputList',
  label: '경력 사항',
  fieldName: 'careers',
  required: false,
  inputConfig: {
    inputs: [
      { type: 'date', width: 30, placeholder: '시작일' },
      { type: 'text', width: 70, placeholder: '회사명' }
    ],
    onlyOne: false
  }
}
```

**제출 데이터 형식**: `MultiInputItem[][]`

```typescript
{
  careers: [
    [
      { type: 'date', value: '2020-01-01', ... },
      { type: 'text', value: '회사A', ... }
    ],
    [
      { type: 'date', value: '2022-06-01', ... },
      { type: 'text', value: '회사B', ... }
    ]
  ]
}
```

### SkillTag 필드 (`type: 'skillTag'`)

태그 형식으로 여러 값을 입력하는 필드입니다. 엔터로 태그를 추가하고, X 버튼으로 삭제할 수 있습니다.

```tsx
{
  type: 'skillTag',
  label: '기술 스택',
  fieldName: 'skills',
  required: true,
  white: false,                    // 배경색 (false: 회색, true: 흰색)
  initialTags: ['React', 'TypeScript']  // 초기 태그 (선택사항)
}
```

**제출 데이터 형식**: `string[]`

```typescript
{
  skills: ['React', 'TypeScript', 'Node.js']
}
```

**특징**:
- 엔터키로 태그 추가
- X 버튼으로 개별 태그 삭제
- 한글 입력 지원 (IME Composition 처리)
- 자동 너비 조정 (react-input-autosize)

### Checkbox 필드 (`type: 'checkbox'`)

단일 체크박스 필드입니다.

```tsx
{
  type: 'checkbox',
  label: '공개 설정',
  fieldName: 'isPublic',
  checkboxLabel: '포트폴리오를 공개합니다'
}
```

**제출 데이터 형식**: `boolean`

```typescript
{
  isPublic: true
}
```

**특징**:
- 비제어/제어 컴포넌트 모두 지원
- 단독 사용 가능 (내부 상태 관리)
- React Hook Form 통합

### Picture 필드 (`type: 'picture'`)

이미지를 업로드하는 필드입니다.

```tsx
{
  type: 'picture',
  label: '프로필 사진',
  fieldName: 'profilePicture',
  required: false,
  aspectRatio: '1:1',    // 비율 설정 ('1:1', '4:3', '16:9' 등)
  multiple: false         // 향후 다중 업로드 지원 (현재 미구현)
}
```

**제출 데이터 형식**: `File | string | null`

```typescript
{
  profilePicture: File // 업로드된 파일 객체
}
```

**특징**:
- 드래그 앤 드롭 지원 예정
- 미리보기 자동 생성
- 비율 맞춤 (aspectRatio)
- 파일 타입 검증 (image/*)

**aspectRatio 예시**:
- `'1:1'`: 정사각형 (프로필 사진)
- `'4:3'`: 일반 사진
- `'16:9'`: 와이드 이미지 (배너, 썸네일)
- `'3:4'`: 세로 이미지

## 실전 예제

### 프로필 작성 폼

```tsx
'use client'

import InputOfModal from '@/app/components/modal/inputs/InputOfModal'
import { FormConfig } from '@/app/components/modal/inputs/types/inputTypes'

const profileConfig: FormConfig = {
  fields: [
    {
      type: 'inputList',
      label: '이름',
      fieldName: 'name',
      required: true,
      inputConfig: {
        inputs: [{ type: 'text', placeholder: '이름을 입력하세요' }],
        onlyOne: true
      }
    },
    {
      type: 'inputList',
      label: '이메일',
      fieldName: 'email',
      required: true,
      inputConfig: {
        inputs: [{ type: 'text', placeholder: 'email@example.com' }],
        onlyOne: true
      }
    },
    {
      type: 'skillTag',
      label: '기술 스택',
      fieldName: 'skills',
      required: true,
      white: false
    },
    {
      type: 'inputList',
      label: '프로젝트 경험',
      fieldName: 'projects',
      required: false,
      inputConfig: {
        inputs: [
          { type: 'text', width: 40, placeholder: '프로젝트명' },
          { type: 'text', width: 30, placeholder: '역할' },
          { type: 'date', width: 30, placeholder: '기간' }
        ]
      }
    },
    {
      type: 'checkbox',
      label: '공개 설정',
      fieldName: 'isPublic',
      checkboxLabel: '내 프로필을 공개합니다'
    }
  ]
}

export default function ProfilePage() {
  const handleSubmit = (data: any) => {
    console.log('제출 데이터:', data)
    // data 구조:
    // {
    //   name: [[{ type: 'text', value: '홍길동', ... }]],
    //   email: [[{ type: 'text', value: 'hong@example.com', ... }]],
    //   skills: ['React', 'TypeScript', 'Next.js'],
    //   projects: [
    //     [
    //       { type: 'text', value: '프로젝트A', ... },
    //       { type: 'text', value: '프론트엔드', ... },
    //       { type: 'date', value: '2023-01', ... }
    //     ]
    //   ],
    //   isPublic: true
    // }
  }

  return (
    <InputOfModal
      title="프로필 작성"
      config={profileConfig}
      onSubmit={handleSubmit}
    />
  )
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
