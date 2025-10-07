'use client';

import React from 'react';
import Inputs from './SingleInput';
import PictureUpload from './PictureUpload';
import { BaseInputProps } from './types/inputTypes';

interface MultiInputItem extends BaseInputProps {
  width?: number; // 퍼센트 값 (0-100)
}

interface MultiInputProps {
  config: MultiInputItem[];
}

function MultiInput({ config }: MultiInputProps) {
  return (
    <div className='flex flex-row gap-2 w-full'>
      {config.map((input, index) => {
        const { width, type, ...inputProps } = input;
        const widthStyle = width ? { width: `${width}%` } : { flex: 1 };
        
        return (
          <div key={index} style={widthStyle}>
            {type === 'picture' ? (
              <PictureUpload aspectRatio={input.aspectRatio} />
            ) : (
              <Inputs type={type} {...inputProps} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default MultiInput;
