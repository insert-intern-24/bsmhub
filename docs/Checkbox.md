# Checkbox 개발자 문서

## 개요

`Checkbox`는 동의 여부나 선택 사항을 표시하는 React 컴포넌트입니다. Controlled와 Uncontrolled 모드를 모두 지원하여 유연하게 사용할 수 있습니다.

## 주요 기능

- ✅ **양방향 모드**: Controlled/Uncontrolled 모드 자동 지원
- 🎨 **시각적 피드백**: Google Material Symbols로 체크 상태 표시
- 🖱️ **쉬운 상호작용**: 레이블 클릭으로 토글
- 🔄 **상태 관리**: 내부 상태와 외부 상태 병합 처리
- 📋 **필수 검증**: React Hook Form과 통합하여 required 검증 지원

## 설치 및 의존성

```typescript
import Checkbox from '@/app/components/modal/inputs/Checkbox'
```

### 필요한 의존성
- React (Client Component)
- Google Material Symbols (globals.css에 포함)
  - `check_box_outline_blank` (미체크 상태)
  - `check_box` (체크 상태)
- Tailwind CSS (font-material-symbols 클래스)

## Props

```typescript
interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
}
```

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `checked` | `boolean` | - | 체크 상태 (Controlled 모드) |
| `onChange` | `(checked: boolean) => void` | - | 상태 변경 콜백 |
| `label` | `string` | `'체크박스'` | 표시할 레이블 텍스트 |

## 사용 방법

### 1. Uncontrolled 모드 (기본)

외부 상태 없이 독립적으로 작동합니다.

```tsx
import Checkbox from '@/app/components/modal/inputs/Checkbox'

function Example() {
  return (
    <div>
      <Checkbox label="이용약관에 동의합니다" />
      <Checkbox label="개인정보 수집에 동의합니다" />
    </div>
  )
}
```

### 2. Controlled 모드

외부 상태로 제어하여 값을 추적합니다.

```tsx
import { useState } from 'react'
import Checkbox from '@/app/components/modal/inputs/Checkbox'

function Example() {
  const [agreed, setAgreed] = useState(false)

  return (
    <div>
      <Checkbox 
        label="이용약관에 동의합니다"
        checked={agreed}
        onChange={setAgreed}
      />
      <button disabled={!agreed}>가입하기</button>
    </div>
  )
}
```

### 3. onChange 콜백만 사용

체크 이벤트를 감지하되 외부 상태로 제어하지 않음.

```tsx
import Checkbox from '@/app/components/modal/inputs/Checkbox'

function Example() {
  const handleChange = (checked: boolean) => {
    console.log('체크 상태:', checked)
    // API 호출 등 부수 효과 처리
  }

  return (
    <Checkbox 
      label="알림 받기"
      onChange={handleChange}
    />
  )
}
```

### 4. React Hook Form 통합

Form 검증과 함께 사용합니다.

```tsx
import { useForm, Controller } from 'react-hook-form'
import Checkbox from '@/app/components/modal/inputs/Checkbox'

function Example() {
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      termsAgreed: false,
    }
  })

  const onSubmit = (data: any) => {
    console.log(data.termsAgreed) // true/false
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="termsAgreed"
        control={control}
        rules={{
          validate: (value) => value || '이용약관에 동의해주세요.'
        }}
        render={({ field }) => (
          <Checkbox
            label="이용약관에 동의합니다"
            checked={field.value}
            onChange={field.onChange}
          />
        )}
      />
      {errors.termsAgreed && (
        <p className="text-red-500">{errors.termsAgreed.message}</p>
      )}
      <button type="submit">제출</button>
    </form>
  )
}
```

### 5. InputOfModal에서 사용 (FormFieldConfig)

```tsx
import InputOfModal from '@/app/components/modal/inputs/InputOfModal'

const formFields: FormFieldConfig[] = [
  {
    type: 'checkbox',
    label: '이용약관에 동의합니다',
    name: 'termsAgreed',
    required: true, // 필수 체크 검증
  },
  {
    type: 'checkbox',
    label: '마케팅 정보 수신 동의 (선택)',
    name: 'marketingAgreed',
    required: false,
  },
]

function Example() {
  const { control } = useForm({
    defaultValues: {
      termsAgreed: false,
      marketingAgreed: false,
    }
  })

  return (
    <div>
      {formFields.map(field => (
        <InputOfModal 
          key={field.name}
          field={field}
          control={control}
        />
      ))}
    </div>
  )
}
```

## 작동 원리

### Controlled/Uncontrolled 자동 전환

```typescript
const [state, setState] = useState(false);

// checked prop이 있으면 Controlled, 없으면 Uncontrolled
const currentValue = checked ?? state;

onClick={() => {
  const next = !currentValue;
  setState(next);      // 내부 상태 업데이트
  onChange?.(next);    // 외부 콜백 호출 (있다면)
}}
```

**핵심 로직**:
- `checked ?? state`: checked가 있으면 사용, 없으면 내부 state 사용
- 항상 내부 state와 onChange 모두 실행
- Props 유무에 관계없이 일관된 동작 보장

### 검증 통합 (InputOfModal)

```typescript
// InputOfModal.tsx의 검증 로직
rules={{ 
  validate: (value) => {
    if (!field.required) return true;
    
    // Checkbox 타입 검증
    if (field.type === 'checkbox' && !value) {
      return `${field.label}에 동의해주세요.`;
    }
    
    return true;
  }
}}
```

`required: true`일 때 체크하지 않으면 에러 메시지가 표시됩니다.

## 스타일링

### 기본 스타일

```tsx
<label className="flex flex-row items-center gap-2 cursor-pointer select-none">
  {/* 아이콘 */}
  <span 
    className="icon-checkbox font-material-symbols transition-colors"
    style={{ 
      fontVariationSettings: `'FILL' ${isChecked ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`
    }}
  >
    {isChecked ? 'check_box' : 'check_box_outline_blank'}
  </span>
  {/* 레이블 */}
  {label}
</label>
```

- **Flexbox**: 아이콘과 텍스트를 수평 정렬
- **gap-2**: 적절한 간격 유지
- **cursor-pointer**: 클릭 가능 표시
- **select-none**: 텍스트 선택 방지
- **font-material-symbols**: Google Material Symbols 폰트 적용
- **fontVariationSettings**: FILL 속성으로 채워진/빈 상태 표현
- **icon-checkbox**: 체크박스 아이콘 전용 스타일 (tailwind.config.ts에 정의)

### 커스텀 스타일 적용

컴포넌트를 감싸서 스타일을 확장할 수 있습니다.

```tsx
<div className="p-4 bg-gray-50 rounded-lg">
  <Checkbox label="알림 받기" />
</div>
```

## 모범 사례

### ✅ 권장사항

```tsx
// 1. 명확한 레이블 사용
<Checkbox label="이메일 알림 받기" />

// 2. 필수 항목은 required 명시
{
  type: 'checkbox',
  label: '필수 동의 사항',
  required: true
}

// 3. Controlled 모드에서 초기값 설정
const [checked, setChecked] = useState(false)
<Checkbox checked={checked} onChange={setChecked} />

// 4. Form에서는 Controller 사용
<Controller
  name="agreed"
  control={control}
  render={({ field }) => (
    <Checkbox checked={field.value} onChange={field.onChange} />
  )}
/>
```

### ❌ 비권장사항

```tsx
// 1. checked만 주고 onChange 없음 (동작 안 함)
<Checkbox checked={value} />  // ❌

// 2. 모호한 레이블
<Checkbox label="동의" />  // ❌ 무엇에 대한 동의?

// 3. 중복 상태 관리
const [state1, setState1] = useState(false)
const [state2, setState2] = useState(false)
<Checkbox 
  checked={state1} 
  onChange={(v) => { setState1(v); setState2(v); }}  // ❌ 복잡함
/>
```

## 타입 정의

```typescript
interface CheckboxProps {
  /**
   * 체크 상태 (Controlled 모드)
   * - 제공하면 Controlled 모드로 작동
   * - 생략하면 Uncontrolled 모드로 작동
   */
  checked?: boolean;
  
  /**
   * 상태 변경 콜백
   * @param checked - 새로운 체크 상태
   */
  onChange?: (checked: boolean) => void;
  
  /**
   * 표시할 레이블 텍스트
   * @default '체크박스'
   */
  label?: string;
}
```

## FormFieldConfig 타입

```typescript
interface CheckboxFieldConfig extends BaseFieldConfig {
  type: 'checkbox';
  label: string;
  name: string;
  required?: boolean;  // 필수 체크 여부
}
```

## 관련 컴포넌트

- **InputOfModal**: Checkbox를 포함한 Form 생성기
- **InputListProvider**: 다중 입력 관리 (배열 타입)
- **SkillTag**: 태그 형태의 다중 입력

## 문제 해결

### Q: Uncontrolled 모드에서 초기값 설정하기

**A**: 컴포넌트 내부의 `useState(false)`를 수정하거나, Controlled 모드로 전환하세요.

```tsx
// 방법 1: 내부 수정 (권장 안 함)
const [state, setState] = useState(initialValue);

// 방법 2: Controlled 모드 사용 (권장)
const [checked, setChecked] = useState(true);  // 초기값 true
<Checkbox checked={checked} onChange={setChecked} />
```

### Q: React Hook Form에서 defaultValue 적용하기

**A**: useForm의 `defaultValues`에 설정하세요.

```tsx
const { control } = useForm({
  defaultValues: {
    agreed: true,  // 체크된 상태로 시작
  }
})
```

### Q: 여러 Checkbox의 전체 선택/해제 구현

**A**: 상위 컴포넌트에서 상태 배열로 관리하세요.

```tsx
const [checks, setChecks] = useState([false, false, false]);
const allChecked = checks.every(Boolean);

const toggleAll = () => {
  setChecks(checks.map(() => !allChecked));
};

return (
  <>
    <Checkbox 
      label="전체 선택" 
      checked={allChecked}
      onChange={toggleAll}
    />
    {checks.map((checked, i) => (
      <Checkbox
        key={i}
        label={`항목 ${i + 1}`}
        checked={checked}
        onChange={(v) => {
          const next = [...checks];
          next[i] = v;
          setChecks(next);
        }}
      />
    ))}
  </>
)
```

## 버전 히스토리

### v1.0.0 (2025-01-08)
- ✨ Controlled/Uncontrolled 모드 자동 지원
- ✨ `checked ?? state` 패턴으로 단순화
- ✨ InputOfModal required 검증 통합
- 🎨 Google Material Symbols 적용
- 📝 완전한 타입 정의

## 라이선스

이 컴포넌트는 프로젝트의 내부 컴포넌트입니다.
