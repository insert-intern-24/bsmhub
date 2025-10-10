'use client';

import React from 'react';
import Inputs from './SingleInput';
import PictureUpload from './PictureUpload';
import type { BaseInputPropsCommon, InputType, InputHTMLType, InputMode } from './types/inputTypes';

export interface MultiInputItem extends Omit<BaseInputPropsCommon, 'type' | 'mode'> {
  type?: InputHTMLType; // 실제 HTML input type
  componentType?: InputType; // 컴포넌트 구분용 (picture 등)
  mode?: InputMode;
  aspectRatio?: string;
  width?: number; // 퍼센트 값 (0-100)
  icon?: 'check' | 'search' | 'calendar';
}

interface MultiInputProps {
  config: MultiInputItem[];
}

function MultiInput({ config }: MultiInputProps) {
  return (
    <div className='flex flex-row gap-2 w-full'>
      {config.map((input, index) => {
        const { width, type, componentType, aspectRatio, mode, icon, ...inputProps } = input;
        const widthStyle = width ? { width: `${width}%` } : { flex: 1 };
        
        return (
          <div key={index} style={widthStyle}>
            {componentType === 'picture' ? (
              <PictureUpload aspectRatio={aspectRatio} />
            ) : (
              <Inputs 
                type={type} 
                mode={mode}
                icon={icon}
                {...inputProps} 
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default MultiInput;
