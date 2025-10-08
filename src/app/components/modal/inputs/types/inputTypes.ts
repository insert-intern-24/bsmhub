import { ChangeEvent } from 'react';
import { InputConfig } from '../InputListProvider';

export type InputType = 'text' | 'lock' | 'date' | 'edit' | 'search' | 'picture' | 'checkbox' | 'skillTag';

// 기본 Input Props (picture 제외)
export interface BaseInputPropsCommon {
  placeholder?: string;
  value?: string | number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  required?: boolean;
  id?: string;
}

// picture 타입일 때
export interface PictureInputProps extends BaseInputPropsCommon {
  type: 'picture';
  aspectRatio?: string;
}

// 다른 타입일 때
export interface StandardInputProps extends BaseInputPropsCommon {
  type?: Exclude<InputType, 'picture'>;
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
  fieldName: string;
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

export type FormFieldConfig = InputListFieldConfig | SkillTagFieldConfig | CheckboxFieldConfig;

// 전체 폼 설정
export interface FormConfig {
  fields: FormFieldConfig[];
}
