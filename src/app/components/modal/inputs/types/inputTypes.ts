import { ChangeEvent } from 'react';
import { InputConfig } from '../InputListProvider';

// 실제 input HTML type
export type InputHTMLType = 'text' | 'date' | 'number' | 'email' | 'password' | 'tel' | 'url';

// 컴포넌트 타입 (FormFieldConfig에서 사용)
export type InputType = 'text' | 'date' | 'edit' | 'search' | 'picture' | 'checkbox' | 'skillTag';

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
export interface PictureInputProps extends Omit<BaseInputPropsCommon, 'type' | 'icon'> {
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
}

export type FormFieldConfig = InputListFieldConfig | SkillTagFieldConfig | CheckboxFieldConfig | PictureFieldConfig;

// 전체 폼 설정
export interface FormConfig {
  fields: FormFieldConfig[];
}
