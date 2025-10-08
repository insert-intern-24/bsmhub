# InputListProvider와 React Hook Form 통합 가이드

## 개요

이 문서는 `InputListProvider`를 React Hook Form과 함께 사용하는 방법을 설명합니다. React Hook Form의 강력한 폼 검증 및 상태 관리 기능과 InputListProvider의 동적 입력 관리를 결합할 수 있습니다.

## 설치

```bash
pnpm add react-hook-form
# or
npm install react-hook-form
# or
yarn add react-hook-form
```

## 기본 통합 패턴

### 패턴 1: Controller 사용 (권장)

React Hook Form의 `Controller`를 사용하여 InputListProvider를 제어된 컴포넌트로 만듭니다.

```tsx
'use client'

import { useForm, Controller } from 'react-hook-form'
import InputListProvider from '@/app/components/modal/inputs/InputListProvider'
import { MultiInputItem } from '@/utils/hook/useInputList'

interface FormData {
  projects: MultiInputItem[][]
  name: string
  email: string
}

export default function ProjectFormWithRHF() {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      projects: [],
      name: '',
      email: ''
    }
  })

  const config = {
    inputs: [
      {
        type: 'text' as const,
        placeholder: '프로젝트명',
        width: 60,
        required: true,
        name: 'projectName'
      },
      {
        type: 'text' as const,
        placeholder: '역할',
        width: 40,
        name: 'role'
      }
    ],
    onlyOne: false  // 여러 개 추가 가능
  }

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data)
    // API 호출 등 처리
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* 일반 입력 필드 */}
      <div>
        <input
          {...control.register('name', { required: '이름을 입력해주세요' })}
          placeholder="이름"
          className="border p-2 w-full"
        />
        {errors.name && (
          <span className="text-red-500 text-sm">{errors.name.message}</span>
        )}
      </div>

      {/* InputListProvider with Controller */}
      <div>
        <label className="block mb-2 font-medium">프로젝트 경험</label>
        <Controller
          name="projects"
          control={control}
          rules={{
            validate: (value) => {
              if (!value || value.length === 0) {
                return '최소 1개의 프로젝트를 입력해주세요'
              }
              // 각 프로젝트의 필수 필드 검증
              const hasEmptyRequired = value.some(project => 
                !project[0]?.value || project[0].value.trim() === ''
              )
              if (hasEmptyRequired) {
                return '프로젝트명은 필수입니다'
              }
              return true
            }
          }}
          render={({ field }) => (
            <InputListProvider
              config={config}
              onInputsChange={field.onChange}
              className="w-full"
            />
          )}
        />
        {errors.projects && (
          <span className="text-red-500 text-sm">{errors.projects.message}</span>
        )}
      </div>

      <button 
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        제출
      </button>
    </form>
  )
}
```

### 패턴 2: 수동 상태 동기화

Controller 없이 `setValue`를 사용하여 수동으로 상태를 동기화합니다.

```tsx
'use client'

import { useForm } from 'react-hook-form'
import InputListProvider from '@/app/components/modal/inputs/InputListProvider'
import { MultiInputItem } from '@/utils/hook/useInputList'

interface FormData {
  skills: MultiInputItem[][]
}

export default function SkillFormManualSync() {
  const { setValue, handleSubmit, watch } = useForm<FormData>({
    defaultValues: {
      skills: []
    }
  })

  const skills = watch('skills')

  const config = {
    inputs: [
      {
        type: 'text' as const,
        placeholder: '기술 스택',
        width: 100
      }
    ],
    onlyOne: false  // 여러 개 추가 가능
  }

  const handleInputsChange = (inputs: MultiInputItem[][]) => {
    setValue('skills', inputs, { 
      shouldValidate: true,
      shouldDirty: true 
    })
  }

  const onSubmit = (data: FormData) => {
    console.log('Skills:', data.skills)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputListProvider
        config={config}
        onInputsChange={handleInputsChange}
      />
      
      {/* 현재 값 표시 (디버깅용) */}
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h3 className="font-bold mb-2">현재 입력된 스킬:</h3>
        <pre>{JSON.stringify(skills, null, 2)}</pre>
      </div>

      <button type="submit" className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
        저장
      </button>
    </form>
  )
}
```

## 고급 사용 사례

### 복잡한 폼 검증

```tsx
'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import InputListProvider from '@/app/components/modal/inputs/InputListProvider'

// Zod 스키마 정의
const projectSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
  email: z.string().email('올바른 이메일을 입력해주세요'),
  projects: z.array(z.array(z.any())).min(1, '최소 1개의 프로젝트가 필요합니다')
})

type ProjectFormData = z.infer<typeof projectSchema>

export default function ValidatedProjectForm() {
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      email: '',
      projects: []
    }
  })

  const config = {
    inputs: [
      {
        type: 'text' as const,
        placeholder: '프로젝트명',
        width: 50,
        required: true
      },
      {
        type: 'date' as const,
        placeholder: '시작일',
        width: 25
      },
      {
        type: 'date' as const,
        placeholder: '종료일',
        width: 25
      }
    ]
  }

  const onSubmit = async (data: ProjectFormData) => {
    try {
      // API 호출
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) throw new Error('제출 실패')
      
      alert('프로젝트가 저장되었습니다!')
    } catch (error) {
      console.error('Error:', error)
      alert('저장에 실패했습니다.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">프로젝트 등록</h1>

      <div>
        <label className="block mb-1 font-medium">이름</label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              className="border p-2 w-full rounded"
              placeholder="홍길동"
            />
          )}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium">이메일</label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="email"
              className="border p-2 w-full rounded"
              placeholder="example@email.com"
            />
          )}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block mb-2 font-medium">프로젝트 경험</label>
        <Controller
          name="projects"
          control={control}
          render={({ field }) => (
            <InputListProvider
              config={config}
              onInputsChange={field.onChange}
            />
          )}
        />
        {errors.projects && (
          <p className="text-red-500 text-sm mt-1">{errors.projects.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-500 text-white py-3 rounded font-medium hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isSubmitting ? '제출 중...' : '제출하기'}
      </button>
    </form>
  )
}
```

### 동적 필드 타입 변경

사용자 선택에 따라 InputListProvider의 설정을 동적으로 변경합니다.

```tsx
'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import InputListProvider from '@/app/components/modal/inputs/InputListProvider'

type ExperienceType = 'project' | 'activity' | 'award'

interface FormData {
  experienceType: ExperienceType
  experiences: any[][]
}

export default function DynamicExperienceForm() {
  const [experienceType, setExperienceType] = useState<ExperienceType>('project')
  
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      experienceType: 'project',
      experiences: []
    }
  })

  // 경험 타입에 따른 설정
  const configs = {
    project: {
      inputs: [
        { type: 'text' as const, placeholder: '프로젝트명', width: 40 },
        { type: 'text' as const, placeholder: '역할', width: 30 },
        { type: 'date' as const, placeholder: '기간', width: 30 }
      ]
    },
    activity: {
      inputs: [
        { type: 'text' as const, placeholder: '활동명', width: 50 },
        { type: 'text' as const, placeholder: '내용', width: 50 }
      ]
    },
    award: {
      inputs: [
        { type: 'text' as const, placeholder: '수상명', width: 60 },
        { type: 'date' as const, placeholder: '수상일', width: 40 }
      ]
    }
  }

  const onSubmit = (data: FormData) => {
    console.log('제출 데이터:', data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
      <div>
        <label className="block mb-2 font-medium">경험 유형</label>
        <select
          value={experienceType}
          onChange={(e) => setExperienceType(e.target.value as ExperienceType)}
          className="border p-2 rounded w-full"
        >
          <option value="project">프로젝트</option>
          <option value="activity">대외활동</option>
          <option value="award">수상경력</option>
        </select>
      </div>

      <div>
        <label className="block mb-2 font-medium">
          {experienceType === 'project' ? '프로젝트 경험' : 
           experienceType === 'activity' ? '대외활동 경험' : '수상 경력'}
        </label>
        <Controller
          name="experiences"
          control={control}
          render={({ field }) => (
            <InputListProvider
              key={experienceType} // 타입 변경 시 리셋
              config={configs[experienceType]}
              onInputsChange={field.onChange}
            />
          )}
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
      >
        저장
      </button>
    </form>
  )
}
```

### 서버 액션과 통합 (Next.js 15)

```tsx
'use client'

import { useForm, Controller } from 'react-hook-form'
import InputListProvider from '@/app/components/modal/inputs/InputListProvider'
import { MultiInputItem } from '@/utils/hook/useInputList'
import { savePortfolio } from './actions' // 서버 액션

interface PortfolioFormData {
  title: string
  description: string
  techStack: MultiInputItem[][]
  features: MultiInputItem[][]
}

export default function PortfolioForm() {
  const { control, handleSubmit, reset } = useForm<PortfolioFormData>({
    defaultValues: {
      title: '',
      description: '',
      techStack: [],
      features: []
    }
  })

  const techStackConfig = {
    inputs: [
      { type: 'text' as const, placeholder: '기술명', width: 70 },
      { type: 'text' as const, placeholder: '숙련도', width: 30 }
    ]
  }

  const featuresConfig = {
    inputs: [
      { type: 'text' as const, placeholder: '기능 설명', width: 100 }
    ]
  }

  const onSubmit = async (data: PortfolioFormData) => {
    try {
      // 서버 액션 호출
      const result = await savePortfolio(data)
      
      if (result.success) {
        alert('포트폴리오가 저장되었습니다!')
        reset()
      } else {
        alert('저장 실패: ' + result.error)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('오류가 발생했습니다.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block mb-2 font-medium">제목</label>
        <Controller
          name="title"
          control={control}
          rules={{ required: '제목을 입력해주세요' }}
          render={({ field, fieldState }) => (
            <>
              <input
                {...field}
                className="border p-2 w-full rounded"
                placeholder="포트폴리오 제목"
              />
              {fieldState.error && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldState.error.message}
                </p>
              )}
            </>
          )}
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">기술 스택</label>
        <Controller
          name="techStack"
          control={control}
          render={({ field }) => (
            <InputListProvider
              config={techStackConfig}
              onInputsChange={field.onChange}
            />
          )}
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">주요 기능</label>
        <Controller
          name="features"
          control={control}
          render={({ field }) => (
            <InputListProvider
              config={featuresConfig}
              onInputsChange={field.onChange}
            />
          )}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-green-500 text-white py-3 rounded hover:bg-green-600"
      >
        저장
      </button>
    </form>
  )
}
```

```typescript
// actions.ts (서버 액션)
'use server'

import { createClient } from '@/utils/supabase/server'

export async function savePortfolio(data: any) {
  try {
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('portfolios')
      .insert({
        title: data.title,
        description: data.description,
        tech_stack: data.techStack,
        features: data.features
      })
    
    if (error) throw error
    
    return { success: true }
  } catch (error) {
    console.error('Save error:', error)
    return { success: false, error: String(error) }
  }
}
```

## 데이터 변환 유틸리티

InputListProvider의 데이터를 다양한 형식으로 변환하는 유틸리티 함수들:

```typescript
// utils/formHelpers.ts
import { MultiInputItem } from '@/utils/hook/useInputList'

/**
 * InputListProvider 데이터를 간단한 문자열 배열로 변환
 */
export function toStringArray(inputs: MultiInputItem[][]): string[] {
  return inputs
    .filter(group => group[0]?.value) // 빈 값 제거
    .map(group => group[0].value as string)
}

/**
 * 여러 필드를 객체 배열로 변환
 */
export function toObjectArray<T>(
  inputs: MultiInputItem[][],
  fieldNames: string[]
): T[] {
  return inputs
    .filter(group => group.some(item => item.value))
    .map(group => {
      const obj: any = {}
      group.forEach((item, index) => {
        if (fieldNames[index]) {
          obj[fieldNames[index]] = item.value
        }
      })
      return obj as T
    })
}

/**
 * 사용 예제
 */
interface Project {
  name: string
  role: string
  period: string
}

const projects: Project[] = toObjectArray(
  inputData,
  ['name', 'role', 'period']
)
```

## 베스트 프랙티스

### 1. 타입 안정성

```typescript
import { InputType } from '@/app/components/modal/inputs/types/inputTypes'

// 설정을 상수로 분리
const PROJECT_CONFIG = {
  inputs: [
    {
      type: 'text' as InputType,
      placeholder: '프로젝트명',
      width: 60,
      required: true
    }
  ]
} as const
```

### 2. 재사용 가능한 폼 컴포넌트

```tsx
// components/forms/ProjectInputField.tsx
import { Controller, Control } from 'react-hook-form'
import InputListProvider from '@/app/components/modal/inputs/InputListProvider'

interface ProjectInputFieldProps {
  name: string
  control: Control<any>
  label?: string
  required?: boolean
}

export function ProjectInputField({
  name,
  control,
  label = '프로젝트',
  required = false
}: ProjectInputFieldProps) {
  const config = {
    inputs: [
      { type: 'text' as const, placeholder: '프로젝트명', width: 50 },
      { type: 'text' as const, placeholder: '역할', width: 50 }
    ]
  }

  return (
    <div>
      {label && (
        <label className="block mb-2 font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        rules={{ required: required ? `${label}을(를) 입력해주세요` : false }}
        render={({ field, fieldState }) => (
          <>
            <InputListProvider
              config={config}
              onInputsChange={field.onChange}
            />
            {fieldState.error && (
              <p className="text-red-500 text-sm mt-1">
                {fieldState.error.message}
              </p>
            )}
          </>
        )}
      />
    </div>
  )
}

// 사용
<ProjectInputField
  name="projects"
  control={control}
  label="프로젝트 경험"
  required
/>
```

### 3. 에러 처리

```tsx
const { control, handleSubmit, setError, clearErrors } = useForm()

const validateProjects = (projects: MultiInputItem[][]) => {
  if (!projects || projects.length === 0) {
    setError('projects', {
      type: 'manual',
      message: '최소 1개의 프로젝트를 입력해주세요'
    })
    return false
  }

  const hasInvalidProject = projects.some(project => {
    const name = project[0]?.value
    return !name || name.trim() === ''
  })

  if (hasInvalidProject) {
    setError('projects', {
      type: 'manual',
      message: '프로젝트명은 필수입니다'
    })
    return false
  }

  clearErrors('projects')
  return true
}
```

## 트러블슈팅

### 문제: 값이 업데이트되지 않음

```tsx
// ❌ 잘못된 방법
<Controller
  name="projects"
  control={control}
  render={({ field }) => (
    <InputListProvider
      config={config}
      onInputsChange={(inputs) => {
        console.log(inputs) // 로그만 찍고 field.onChange 호출 안함
      }}
    />
  )}
/>

// ✅ 올바른 방법
<Controller
  name="projects"
  control={control}
  render={({ field }) => (
    <InputListProvider
      config={config}
      onInputsChange={field.onChange}
    />
  )}
/>
```

### 문제: 제출 시 빈 배열

설정에 초기값이 있는지 확인하세요:

```tsx
const { control } = useForm({
  defaultValues: {
    projects: [] // 초기값 설정 필요
  }
})
```

## InputOfModal: Config 기반 폼 생성

`InputOfModal`은 설정(config)을 기반으로 자동으로 폼을 생성하는 고수준 컴포넌트입니다. Label과 InputListProvider를 쌍으로 관리하며, React Hook Form이 내장되어 있습니다.

### 기본 사용법

```tsx
import InputOfModal from '@/app/components/modal/inputs/InputOfModal'
import { FormConfig } from '@/app/components/modal/inputs/types/inputTypes'

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
        onlyOne: true  // 단일 입력만 허용
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
    }
  ]
}

export default function MyPage() {
  const handleSubmit = (data) => {
    console.log('제출된 데이터:', data)
    // API 호출 등
  }

  return (
    <InputOfModal
      title="프로필 작성"
      config={formConfig}
      onSubmit={handleSubmit}
    />
  )
}
```

### Props

| Prop | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `title` | `string` | ❌ | `'입력 필드'` | 폼 제목 |
| `config` | `FormConfig` | ✅ | - | 폼 필드 설정 |
| `onSubmit` | `(data: Record<string, MultiInputItem[][]>) => void` | ❌ | - | 제출 콜백 |

### FormConfig 타입

```typescript
interface FormFieldConfig {
  label: string              // 필드 라벨
  required?: boolean         // 필수 여부
  fieldName: string          // React Hook Form 필드명
  inputConfig: InputConfig   // InputListProvider 설정
}

interface FormConfig {
  fields: FormFieldConfig[]
}
```

### 장점

✅ **선언적 설정**: Config만 작성하면 자동으로 폼 생성  
✅ **내장 검증**: 필수 필드 자동 검증  
✅ **일관된 UI**: Label, Input, Error 메시지 자동 배치  
✅ **타입 안전**: TypeScript로 타입 체크  

### 사용 시나리오

- 빠른 프로토타이핑
- 반복적인 폼 구조가 많은 경우
- 일관된 폼 UI가 필요한 경우
- 설정 기반 동적 폼 생성

## 관련 자료

- [React Hook Form 공식 문서](https://react-hook-form.com/)
- [InputListProvider 문서](./InputListProvider.md)
- [Zod 검증 라이브러리](https://zod.dev/)

## 요약

- `Controller`를 사용하여 InputListProvider를 React Hook Form과 통합
- `onInputsChange` 콜백을 `field.onChange`에 연결
- 복잡한 검증은 Zod 등의 스키마 검증 라이브러리 활용
- 재사용 가능한 컴포넌트로 만들어 코드 중복 방지
- `InputOfModal`을 사용하면 Config 기반으로 빠르게 폼 생성 가능
- 타입 안정성을 위해 TypeScript 적극 활용
