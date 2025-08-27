import { ChangeEvent } from 'react';

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
