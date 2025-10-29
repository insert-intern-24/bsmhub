import { ChangeEvent } from 'react';
import { InputConfig } from '../InputListProvider';

// GraphQL 쿼리 생성을 위한 컬럼 정보
export interface ColumnInfo {
  table: string;
  column: string;
}

// 실제 input HTML type
export type InputHTMLType =
  | 'text'
  | 'date'
  | 'number'
  | 'email'
  | 'password'
  | 'tel'
  | 'url';

// 컴포넌트 타입 (FormFieldConfig에서 사용)
export type InputType =
  | 'text'
  | 'date'
  | 'edit'
  | 'search'
  | 'picture'
  | 'checkbox'
  | 'skillTag';

// Input 모드 (SkillTag처럼 write/edit/read)
export type InputMode = 'write' | 'edit' | 'read';

// 기본 Input Props (picture 제외)
export interface BaseInputPropsCommon {
  mode?: InputMode;
  type?: InputHTMLType;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  required?: boolean;
  id?: string;
  icon?: 'check' | 'search' | 'calendar';
}

// picture 타입일 때
export interface PictureInputProps
  extends Omit<BaseInputPropsCommon, 'type' | 'icon'> {
  componentType: 'picture';
  aspectRatio?: string;
}

// 다른 타입일 때
export interface StandardInputProps extends BaseInputPropsCommon {
  componentType?: 'input';
  aspectRatio?: never;
}

// Union 타입으로 결합
export type BaseInputProps = PictureInputProps | StandardInputProps;

export type LabelInputsProps = BaseInputProps & {
  label?: string;
};

// FormField 타입별 설정
interface BaseFieldConfig {
  label: string;
  required?: boolean;
  fieldName: string; // "테이블명.속성" 형식으로 데이터베이스 컬럼 매핑
  columnInfo?: ColumnInfo; // GraphQL 쿼리 생성을 위한 컬럼 정보
  relationHandler?: {
    type: 'rest' | 'graphql';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handler?: (...args: any[]) => any; // 핸들러 함수 자체
    identifierIsStudnetId?: boolean; // ID 조회/생성이 필요한지 여부
    dataTransformer?: (data: unknown[]) => unknown[]; // 데이터 변환 함수
    deleteFilterGenerator?: (
      item: Record<string, unknown>,
      profileId: string,
    ) => Record<string, unknown>; // 삭제 필터 생성 함수
    changeCalculator?: (
      newData: unknown[],
      existingData: Record<string, unknown>[],
    ) => {
      toDelete: Record<string, unknown>[];
      toInsert: Record<string, unknown>[];
    }; // 변경사항 계산 함수
  };
}

// InputList 타입
interface InputListFieldConfig extends BaseFieldConfig {
  type: 'inputList';
  inputConfig: InputConfig;
}

// SkillTag 타입
interface SkillTagFieldConfig extends BaseFieldConfig {
  type: 'skillTag';
  white?: boolean;
  valuePath?: string; // GraphQL 응답에서 값을 추출할 경로 (예: 'skill.skill_name')
}

// Checkbox 타입
interface CheckboxFieldConfig extends BaseFieldConfig {
  type: 'checkbox';
  label: string;
  checkboxLabel?: string;
}

// Picture 타입
interface PictureFieldConfig extends BaseFieldConfig {
  type: 'picture';
  aspectRatio?: string;
  multiple?: boolean; // 여러 이미지 업로드 가능 여부
  bucket: string;
}

export type FormFieldConfig =
  | InputListFieldConfig
  | SkillTagFieldConfig
  | CheckboxFieldConfig
  | PictureFieldConfig;

// 전체 폼 설정
export interface FormConfig {
  fields: FormFieldConfig[];
  // GraphQL 쿼리 (필수: 사용자가 직접 작성)
  graphql: {
    read: string; // 조회 쿼리
    insert: string; // 삽입 mutation
    update: string; // 업데이트 mutation
  };
}
