import { ChangeEvent } from 'react';
import { InputConfig } from '../InputListProvider';

export type InputType = 'text' | 'lock' | 'date' | 'edit' | 'search';

export interface BaseInputProps {
  type?: InputType;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  required?: boolean;
  id?: string;
}

export interface LabelInputsProps extends BaseInputProps {
  label?: string;
}

// FormField: label과 InputListProvider 쌍의 설정
export interface FormFieldConfig {
  label: string;
  required?: boolean;
  fieldName: string; // React Hook Form의 필드명
  inputConfig: InputConfig; // InputListProvider의 설정
}

// 전체 폼 설정
export interface FormConfig {
  fields: FormFieldConfig[];
}
