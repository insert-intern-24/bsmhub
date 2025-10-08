import React from 'react';
import { LabelInputsProps } from './types/inputTypes';

function LabelOfInputs({
  label = 'Label',
  required = false,
}: LabelInputsProps) {
  return (
    <label className="text-black text-label">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
  );
}

export default LabelOfInputs;
