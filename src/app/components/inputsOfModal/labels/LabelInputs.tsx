import React from 'react';
import Inputs from '../inputs/Inputs';
import { LabelInputsProps } from '../types/inputTypes';

function LabelInputs({
  label = 'Label',
  type = 'text',
  placeholder = 'Placeholder',
  value,
  onChange,
  name,
  required = false,
  id = 'labelInputs',
}: LabelInputsProps) {
  return (
    <>
      <div className="flex w-full flex-col items-start gap-0.5">
        <div className="flex items-center gap-0.5">
          <label
            htmlFor={id}
            className="text-black text-sm font-normal leading-5 tracking-wider"
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        </div>
        <Inputs
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          name={name}
          required={required}
          id={id}
        />
      </div>
    </>
  );
}

export default LabelInputs;
