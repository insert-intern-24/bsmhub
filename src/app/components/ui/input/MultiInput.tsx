'use client';

import React from 'react';
import Inputs from './SingleInput';
import DropdownInput from './DropdownInput';
import PictureUpload from './PictureUpload';
import type {
  BaseInputPropsCommon,
  InputType,
  InputHTMLType,
  InputMode,
} from './types/inputTypes';
import { DropdownInputConfig } from '@/app/components/modal/inputs/InputListProvider';

export interface MultiInputItem
  extends Omit<BaseInputPropsCommon, 'type' | 'mode'> {
  type?: InputHTMLType; // 실제 HTML input type
  componentType?: InputType; // 컴포넌트 구분용 (picture 등)
  mode?: InputMode;
  aspectRatio?: string;
  width?: number; // 퍼센트 값 (0-100)
  icon?: 'check' | 'search' | 'calendar';
}

interface MultiInputProps {
  config: MultiInputItem[];
  dropdownInputConfig?: DropdownInputConfig;
  suggestions?: Record<string, unknown>[];
  tableData?: Record<string, unknown>[];
  groupIndex?: number;
  onlyOne?: boolean;
  required?: boolean;
  onInputChange?: (value: string) => void;
  onInputFocus?: () => void;
  onDelete?: (index: number) => void;
  onOptionSelect?: () => void;
}

const MultiInput = ({
  config,
  dropdownInputConfig,
  suggestions = [],
  onInputChange,
  onInputFocus,
  tableData = [],
  onDelete,
  groupIndex,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onlyOne = false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  required = false,
  onOptionSelect,
}: MultiInputProps) => {
  return (
    <div className="flex flex-row gap-2 w-full relative">
      {config.map((input, index) => {
        const {
          width,
          type,
          componentType,
          aspectRatio,
          mode,
          icon,
          textarea,
          ...inputProps
        } = input;
        const widthStyle = width ? { width: `${width}%` } : { flex: 1 };

        // 첫 번째 input이고 dropdownInputConfig가 있으면 DropdownInput 사용
        if (index === 0 && dropdownInputConfig) {
          return (
            <div key={index} style={widthStyle}>
              <DropdownInput
                type={type}
                mode={mode}
                icon={icon}
                suggestions={suggestions}
                tableData={tableData}
                onInputChange={onInputChange!}
                onInputFocus={onInputFocus}
                dropdownInputConfig={dropdownInputConfig}
                onOptionSelect={onOptionSelect}
                onlyOne={onlyOne}
                onDelete={onDelete ? () => onDelete(groupIndex!) : undefined}
                {...inputProps}
              />
            </div>
          );
        }

        return (
          <div key={index} style={widthStyle}>
            {componentType === 'picture' ? (
              <PictureUpload aspectRatio={aspectRatio} />
            ) : (
              <Inputs type={type} mode={mode} icon={icon} textarea={textarea} {...inputProps} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MultiInput;
