import React from 'react';
import { LabelInputsProps } from './types/inputTypes';

const LabelOfInputs = ({
  label = 'Label',
  required = false,
  description,
}: LabelInputsProps) => {
  return (
    <div className="flex flex-row items-center w-full flex-nowrap">
      <span className="text-black text-label whitespace-nowrap">
        {label}
      </span>
      {required && <span className="text-red-primary whitespace-nowrap">*</span>}
      {description && (
        <span className="ml-1 text-gray-footer whitespace-nowrap text-label">
          {"(" + description + ")"}
        </span>
      )}
    </div>
  );
};

export default LabelOfInputs;
 