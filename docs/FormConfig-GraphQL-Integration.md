# FormConfig와 GraphQL 쿼리 생성기 연동 가이드

## 개요

FormConfig는 폼 필드의 설정을 정의하는 구조체입니다. 이 가이드는 FormConfig에 ColumnInfo를 추가하여 자동으로 GraphQL 쿼리를 생성하는 방법을 설명합니다.

## FormConfig 구조

### 기본 구조

```typescript
interface FormConfig {
  fields: FormFieldConfig[];
}

interface BaseFieldConfig {
  label: string;
  required?: boolean;
  fieldName: string;
  columnInfo?: ColumnInfo; // GraphQL 쿼리 생성을 위한 컬럼 정보
}
```

### ColumnInfo 추가

각 필드에 `columnInfo` 속성을 추가하여 데이터베이스 테이블과 컬럼 정보를 지정할 수 있습니다:

```typescript
interface ColumnInfo {
  table: string;    // 테이블명
  column: string;   // 컬럼명
}
```

## 필드 타입별 설정

### 1. InputList 필드

```typescript
{
  fieldName: 'profiles.full_name',
  label: '이름',
  type: 'inputList',
  required: true,
  columnInfo: { table: 'profile', column: 'profile_name' },
  inputConfig: {
    onlyOne: true,
    inputs: [
      {
        name: 'name',
        type: 'text',
        placeholder: '이름을 입력하세요',
        required: true
      }
    ]
  }
}
```

### 2. Picture 필드

```typescript
{
  fieldName: 'profiles.avatar_url',
  label: '프로필 이미지',
  type: 'picture',
  required: false,
  columnInfo: { table: 'profile', column: 'profile_image' },
  aspectRatio: '1:1'
}
```

### 3. SkillTag 필드

```typescript
{
  fieldName: 'profile_skills',
  label: '기술 스택',
  type: 'skillTag',
  required: false,
  columnInfo: { table: 'profile_skills', column: 'skill_id' }
}
```

### 4. Checkbox 필드

```typescript
{
  fieldName: 'profile.is_team',
  label: '팀 여부',
  type: 'checkbox',
  columnInfo: { table: 'profile', column: 'is_team' },
  checkboxLabel: '팀 프로필입니다'
}
```

## 실제 사용 예시

### 프로필 폼 설정

```typescript
import { FormConfig } from '@/app/components/modal/inputs/types/inputTypes';

export const profileFormConfig: FormConfig = {
  fields: [
    {
      fieldName: 'profiles.full_name',
      label: '이름',
      type: 'inputList',
      required: true,
      columnInfo: { table: 'profile', column: 'profile_name' },
      inputConfig: {
        onlyOne: true,
        inputs: [
          {
            name: 'name',
            type: 'text',
            placeholder: '이름을 입력하세요',
            required: true
          }
        ]
      }
    },
    {
      fieldName: 'profiles.student_number',
      label: '학번',
      type: 'inputList',
      required: true,
      columnInfo: { table: 'student', column: 'student_number' },
      inputConfig: {
        onlyOne: true,
        inputs: [
          {
            name: 'number',
            type: 'text',
            placeholder: '학번을 입력하세요',
            required: true
          }
        ]
      }
    },
    {
      fieldName: 'profiles.avatar_url',
      label: '프로필 이미지',
      type: 'picture',
      required: false,
      columnInfo: { table: 'profile', column: 'profile_image' },
      aspectRatio: '1:1'
    },
    {
      fieldName: 'profiles.bio',
      label: '자기소개',
      type: 'inputList',
      required: false,
      columnInfo: { table: 'profile', column: 'description' },
      inputConfig: {
        onlyOne: true,
        inputs: [
          {
            name: 'description',
            type: 'text',
            placeholder: '자기소개를 입력하세요',
            required: false
          }
        ]
      }
    }
  ]
};
```

## GraphQL 쿼리 생성

### 1. 기본 사용법

```typescript
import { getColumnInfoArray } from '@/utils/graphQL/form-config-utils';
import { generateGraphQLQuery } from '@/utils/graphQL/generateGraphQLQuery';

// FormConfig에서 ColumnInfo 추출
const columnInfoArray = getColumnInfoArray(profileFormConfig);

// GraphQL 쿼리 생성
const query = generateGraphQLQuery(columnInfoArray);
console.log(query);
```

**생성되는 쿼리:**
```graphql
{
  profile {
    profile_name
    profile_image
    description
  }
  student {
    student_number
  }
}
```

### 2. 고급 사용법

#### 특정 필드만 포함

```typescript
import { getColumnInfoByFieldName } from '@/utils/graphQL/form-config-utils';

// 특정 필드의 ColumnInfo만 가져오기
const nameColumnInfo = getColumnInfoByFieldName(profileFormConfig, 'profiles.full_name');
const avatarColumnInfo = getColumnInfoByFieldName(profileFormConfig, 'profiles.avatar_url');

// 선택된 필드들로만 쿼리 생성
const selectedColumns = [nameColumnInfo, avatarColumnInfo].filter(Boolean);
const query = generateGraphQLQuery(selectedColumns);
```

#### 동적 필드 선택

```typescript
function createQueryForFields(formConfig: FormConfig, fieldNames: string[]) {
  const columnInfoArray = fieldNames
    .map(fieldName => getColumnInfoByFieldName(formConfig, fieldName))
    .filter(Boolean);
  
  return generateGraphQLQuery(columnInfoArray);
}

// 사용 예시
const query = createQueryForFields(profileFormConfig, [
  'profiles.full_name',
  'profiles.avatar_url'
]);
```

## 유틸리티 함수들

### extractColumnInfoFromFormConfig

FormConfig에서 모든 필드의 ColumnInfo를 추출하여 매칭 객체를 생성합니다.

```typescript
import { extractColumnInfoFromFormConfig } from '@/utils/graphQL/form-config-utils';

const columnInfoMap = extractColumnInfoFromFormConfig(profileFormConfig);
console.log(columnInfoMap);
// {
//   "profiles.full_name": { table: 'profile', column: 'profile_name' },
//   "profiles.student_number": { table: 'student', column: 'student_number' },
//   "profiles.avatar_url": { table: 'profile', column: 'profile_image' },
//   "profiles.bio": { table: 'profile', column: 'description' }
// }
```

### getColumnInfoArray

FormConfig에서 ColumnInfo 배열을 추출합니다.

```typescript
import { getColumnInfoArray } from '@/utils/graphQL/form-config-utils';

const columnInfoArray = getColumnInfoArray(profileFormConfig);
console.log(columnInfoArray);
// [
//   { table: 'profile', column: 'profile_name' },
//   { table: 'student', column: 'student_number' },
//   { table: 'profile', column: 'profile_image' },
//   { table: 'profile', column: 'description' }
// ]
```

### getColumnInfoByFieldName

특정 필드명에 해당하는 ColumnInfo를 가져옵니다.

```typescript
import { getColumnInfoByFieldName } from '@/utils/graphQL/form-config-utils';

const nameColumnInfo = getColumnInfoByFieldName(profileFormConfig, 'profiles.full_name');
console.log(nameColumnInfo); // { table: 'profile', column: 'profile_name' }
```

## 자동 fallback 처리

ColumnInfo가 명시적으로 설정되지 않은 경우, `fieldName`에서 자동으로 추출합니다:

```typescript
// columnInfo가 없는 경우
{
  fieldName: 'profiles.email',  // "profiles.email"에서 자동 추출
  label: '이메일',
  type: 'inputList'
  // columnInfo가 없으면 fieldName에서 추출: { table: 'profiles', column: 'email' }
}
```

## 모범 사례

### 1. 명시적 ColumnInfo 사용

가능한 한 명시적으로 `columnInfo`를 설정하는 것을 권장합니다:

```typescript
// 좋은 예시
{
  fieldName: 'profiles.full_name',
  columnInfo: { table: 'profile', column: 'profile_name' } // 명시적 설정
}

// 피해야 할 예시
{
  fieldName: 'profiles.full_name' // fieldName에 의존
}
```

### 2. 일관된 네이밍

테이블명과 컬럼명을 일관되게 사용합니다:

```typescript
// 일관된 네이밍
columnInfo: { table: 'profile', column: 'profile_name' }
columnInfo: { table: 'profile', column: 'profile_image' }
columnInfo: { table: 'profile', column: 'profile_description' }
```

### 3. 관계 고려

테이블 간의 관계를 고려하여 적절한 테이블을 지정합니다:

```typescript
// 프로필 정보
columnInfo: { table: 'profile', column: 'profile_name' }

// 학생 정보 (프로필과 별도 테이블)
columnInfo: { table: 'student', column: 'student_number' }

// 프로젝트 정보 (프로필과 관계)
columnInfo: { table: 'projects', column: 'project_name' }
```

## 테스트

### 테스트 실행

```bash
# FormConfig 연동 테스트
npx tsx src/utils/graphQL/form-config-utils.test.ts
```

### 테스트 예시

```typescript
// 테스트용 FormConfig
const testFormConfig: FormConfig = {
  fields: [
    {
      fieldName: 'test.field1',
      label: '테스트 필드 1',
      type: 'inputList',
      columnInfo: { table: 'test_table', column: 'test_column1' },
      inputConfig: { /* ... */ }
    }
  ]
};

// 테스트 실행
const columnInfoArray = getColumnInfoArray(testFormConfig);
const query = generateGraphQLQuery(columnInfoArray);
console.log(query);
```

## 문제 해결

### 자주 발생하는 문제

1. **ColumnInfo가 추출되지 않는 경우**
   - FormConfig의 각 필드에 `columnInfo` 속성이 올바르게 설정되었는지 확인
   - `fieldName`이 "테이블명.컬럼명" 형식인지 확인

2. **테이블 관계가 인식되지 않는 경우**
   - `generateGraphQLQuery.ts`의 `extractTableRelationships` 함수에 해당 관계가 정의되어 있는지 확인

3. **TypeScript 오류**
   - `BaseFieldConfig` 인터페이스에 `columnInfo?: ColumnInfo` 속성이 추가되었는지 확인

## 확장 가능성

### 새로운 필드 타입 추가

새로운 필드 타입을 추가할 때도 동일한 방식으로 `columnInfo`를 설정할 수 있습니다:

```typescript
interface NewFieldConfig extends BaseFieldConfig {
  type: 'newFieldType';
  // ... 기타 속성들
  // columnInfo는 BaseFieldConfig에서 상속됨
}
```

### 동적 FormConfig 생성

런타임에 FormConfig를 동적으로 생성하여 쿼리를 생성할 수도 있습니다:

```typescript
function createDynamicFormConfig(fields: Array<{fieldName: string, table: string, column: string}>) {
  const formConfig: FormConfig = {
    fields: fields.map(field => ({
      fieldName: field.fieldName,
      label: field.fieldName,
      type: 'inputList',
      columnInfo: { table: field.table, column: field.column },
      inputConfig: { /* 기본 설정 */ }
    }))
  };
  
  return formConfig;
}
```

이 가이드를 통해 FormConfig와 GraphQL 쿼리 생성기를 효과적으로 연동할 수 있습니다.
