'use client';

import React, { forwardRef } from 'react';

export interface InputProps {
  label: string;
  placeholder: string;
  name: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, placeholder, name }, ref) => {
    return (
      <div className="flex flex-col">
        <label className="text-[1rem] font-medium text-titleColor">
          {label}
        </label>
        <input
          ref={ref}
          name={name}
          placeholder={placeholder}
          className="w-full h-12 bg-[#F5F5F7] rounded-md px-3"
        />
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
