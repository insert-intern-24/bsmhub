'use client';

import React from 'react';
import { useInputList } from '@/utils/hook/useInputList';
import MultiInput, { type MultiInputItem } from './MultiInput';
import { InputType, InputHTMLType, InputMode } from './types/inputTypes';
import { useToast } from '@/app/components/toast';

// Input 설정 타입 - inputs 배열로 통일
export type InputConfig = {
  inputs: Array<{
    type?: InputHTMLType; // 실제 HTML input type
    componentType?: InputType; // 컴포넌트 구분 (picture 등)
    mode?: InputMode;
    width?: number;
    placeholder?: string;
    name?: string;
    required?: boolean;
    aspectRatio?: string;
    icon?: 'check' | 'search' | 'calendar';
  }>;
  onlyOne?: boolean;
  white?: boolean; // SkillTag용
  multiInputConfig?: Array<{ placeholder?: string }>; // Checkbox용
};

export type DropdownInputConfig = {
  nameColumnName: string;
  valueColumnName: string;
  query?: () => Promise<Record<string, unknown>[]>;
};

interface InputListProviderProps {
  config: InputConfig;
  dropdownInputConfig?: DropdownInputConfig;
  initialValue?: MultiInputItem[][];
  className?: string;
  onlyOne?: boolean;
  required?: boolean;
  onInputsChange?: (inputs: MultiInputItem[][]) => void;
}

// 프레젠테이션 컴포넌트
const InputListProvider = ({
  config,
  dropdownInputConfig,
  className = '',
  onInputsChange,
  initialValue,
  // maxInputs,
  onlyOne = config.onlyOne ?? false,
  required = false,
}: InputListProviderProps) => {
  // config를 MultiInputItem으로 변환
  const initialConfig = config.inputs.map((input) => ({
    type: input.type || 'text',
    componentType: input.componentType,
    mode: input.mode,
    width: input.width,
    placeholder: input.placeholder,
    name: input.name,
    required: input.required,
    aspectRatio: input.aspectRatio,
    icon: input.icon,
    value: '',
  })) as MultiInputItem[];

  // onlyOne이 false이고 initialValue가 없거나 빈 배열이면, 최소 하나의 빈 그룹 생성
  const defaultInitialValue = 
    initialValue && initialValue.length > 0
      ? initialValue
      : onlyOne
        ? initialConfig
        : [initialConfig];

  const [{ inputs, activeIndex }, dispatch] = useInputList(
    defaultInitialValue,
  );

  // 테이블 데이터 및 추천 상태
  const [tableData, setTableData] = React.useState<Record<string, unknown>[]>(
    [],
  );
  const [suggestions, setSuggestions] = React.useState<
    Record<string, unknown>[]
  >([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  // const [loading, setLoading] = React.useState(false)
  // const [error, setError] = React.useState<string | null>(null)

  const { showToast } = useToast();

  // dropdownInputConfig가 있으면 테이블 데이터 로드
  React.useEffect(() => {
    if (dropdownInputConfig?.query) {
      // 커스텀 쿼리 함수가 있으면 사용
      dropdownInputConfig
        .query()
        .then((data) => {
          setTableData(data);
        })
        .catch((error) => {
          showToast(
            error instanceof Error ? error.message : '데이터를 불러오는 중 오류가 발생했습니다.',
            'error',
            3000,
            '오류'
          );
        });
    }
  }, [dropdownInputConfig, showToast]);

  // onlyOne일 때 input 클릭/포커스 시 모든 옵션 표시
  const handleInputFocus = () => {
    if (onlyOne && dropdownInputConfig && tableData.length > 0) {
      const selectedValues = new Set(
        inputs
          .flat()
          .map((item) => item.value)
          .filter(Boolean),
      );
      const filtered = tableData.filter((item) => {
        const itemValue = item[dropdownInputConfig.valueColumnName] as string;
        return !selectedValues.has(itemValue);
      });
      setSuggestions(filtered);
      setShowSuggestions(true);
    }
  };

  // 추천 필터링 함수
  const handleInputChange = (value: string) => {
    if (dropdownInputConfig && tableData.length > 0) {
      // 이미 선택된 값들을 추출
      const selectedValues = new Set(
        inputs
          .flat()
          .map((item) => item.value)
          .filter(Boolean),
      );

      // onlyOne일 때 빈 값이면 모든 옵션 표시
      if (onlyOne && value === '') {
        const filtered = tableData.filter((item) => {
          const itemValue = item[dropdownInputConfig.valueColumnName] as string;
          return !selectedValues.has(itemValue);
        });
        setSuggestions(filtered);
        setShowSuggestions(true);
        return;
      }

      const filtered = tableData.filter((item) => {
        const itemValue = item[dropdownInputConfig.valueColumnName] as string;
        const itemName = (
          item[dropdownInputConfig.nameColumnName] as string
        )?.toLowerCase();

        // 이미 선택된 값은 제외하고, 입력값으로 필터링
        return (
          !selectedValues.has(itemValue) &&
          itemName?.includes(value.toLowerCase())
        );
      });
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // 옵션 선택 후 드롭다운 닫기
  const handleOptionSelect = () => {
    setShowSuggestions(false);
    setSuggestions([]);
  };

  // inputs가 변경될 때마다 콜백 호출
  React.useEffect(() => {
    onInputsChange?.(inputs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs]);

  const handleAddInput = () => {
    // maxInputs 체크
    // if (maxInputs && inputs.length >= maxInputs) {
    //   return
    // }

    dispatch({
      type: 'ADD_INPUT',
      multiInputConfig: initialConfig,
    });
  };

  const handleDeleteInput = (index: number) => {
    // 필수 필드이고 드롭다운일 때 최소 하나는 남겨야 함
    if (required && dropdownInputConfig && inputs.length <= 1) {
      // onlyOne일 때는 삭제하지 않고 값만 지움
      if (onlyOne) {
        const input = inputs[index];
        if (input && input.length > 0) {
          input.forEach((_, subIndex) => {
            dispatch({
              type: 'UPDATE_VALUE',
              index,
              subIndex,
              value: '',
            });
          });
        }
      }
      return;
    }
    
    // onlyOne일 때는 삭제하지 않고 값만 지움
    if (onlyOne) {
      const input = inputs[index];
      if (input && input.length > 0) {
        input.forEach((_, subIndex) => {
          dispatch({
            type: 'UPDATE_VALUE',
            index,
            subIndex,
            value: '',
          });
        });
      }
      return;
    }
    
    dispatch({ type: 'DELETE_INPUT', index });
  };

  // const canAddMore = !maxInputs || inputs.length < maxInputs

  return (
    <div className={`flex-col gap-2 items-start ${className}`}>
      {inputs.map((input: MultiInputItem[], index: number) => {
        const isReadOnly = activeIndex !== null && activeIndex !== index;

        return (
          <div
            key={index}
            className="w-full"
            onClick={() => dispatch({ type: 'SET_ACTIVE', index })}
          >
            <MultiInput
              config={input.map((item: MultiInputItem, subIndex: number) => ({
                ...item,
                mode: isReadOnly ? 'read' : item.mode || 'write',
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  dispatch({
                    type: 'UPDATE_VALUE',
                    index,
                    subIndex,
                    value: e.target.value,
                  });
                  // 값이 변경되면 드롭다운 닫기 (옵션 선택 시)
                  if (dropdownInputConfig && e.target.value) {
                    handleOptionSelect();
                  }
                },
              }))}
              dropdownInputConfig={dropdownInputConfig}
              suggestions={showSuggestions ? suggestions : []}
              onInputChange={handleInputChange}
              onInputFocus={handleInputFocus}
              tableData={tableData}
              onDelete={handleDeleteInput}
              groupIndex={index}
              onlyOne={onlyOne}
              required={required && dropdownInputConfig !== undefined}
              onOptionSelect={handleOptionSelect}
            />
          </div>
        );
      })}

      {!onlyOne && (
        <button
          type="button"
          className="text-label text-gray-500"
          onClick={handleAddInput}
        >
          + 추가하기
        </button>
      )}
    </div>
  );
};

export default InputListProvider;
