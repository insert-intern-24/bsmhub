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
import { DropdownInputConfig } from './InputListProvider';

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
  onInputChange?: (value: string) => void;
  tableData?: Record<string, unknown>[];
  onDelete?: (index: number) => void;
  groupIndex?: number;
}

function MultiInput({
  config,
  dropdownInputConfig,
  suggestions = [],
  onInputChange,
  tableData = [],
  onDelete,
  groupIndex,
}: MultiInputProps) {
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
          ...inputProps
        } = input;
        const widthStyle = width ? { width: `${width}%` } : { flex: 1 };

        // 첫 번째 input이고 dropdownInputConfig가 있으면 특별 처리
        if (index === 0 && dropdownInputConfig) {
          const value = inputProps.value as string;
          const selectedItem = tableData.find(
            (item) => item[dropdownInputConfig.valueColumnName] === value,
          );
          const displayName = selectedItem
            ? (selectedItem[dropdownInputConfig.nameColumnName] as string)
            : '';

          if (value && displayName) {
            // 선택된 상태: 이름 표시 + X 버튼
            return (
              <div
                key={index}
                style={widthStyle}
                className="flex items-center gap-2 px-2.5 py-1 text-gray-base text-body bg-light-gray-outline rounded input-common"
              >
                <span>{displayName}</span>
                <button
                  type="button"
                  onClick={() => onDelete?.(groupIndex!)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            );
          } else {
            // 입력 상태: DropdownInput 사용
            return (
              <div key={index} style={widthStyle}>
                <DropdownInput
                  type={type}
                  mode={mode}
                  icon={icon}
                  suggestions={suggestions}
                  onInputChange={onInputChange!}
                  dropdownInputConfig={dropdownInputConfig}
                  {...inputProps}
                />
              </div>
            );
          }
        }

        return (
          <div key={index} style={widthStyle}>
            {componentType === 'picture' ? (
              <PictureUpload aspectRatio={aspectRatio} />
            ) : (
              <Inputs type={type} mode={mode} icon={icon} {...inputProps} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default MultiInput;
