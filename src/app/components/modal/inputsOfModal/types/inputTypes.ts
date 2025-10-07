import { ChangeEvent } from 'react';
import { InputConfig } from '../InputListProvider';

export type InputType = 'text' | 'lock' | 'date' | 'edit' | 'search' | 'picture';

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
