'use client';

import React from 'react';
import { useInputList } from '@/utils/hook/useInputList';
import MultiInput, { type MultiInputItem } from '@/app/components/ui/input/MultiInput';
import { InputType, InputHTMLType, InputMode } from '@/app/components/ui/input/types/inputTypes';
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
    textarea?: boolean; // textarea로 렌더링할지 여부
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
    textarea: input.textarea,
    value: '',
  })) as MultiInputItem[];

  // onlyOne이 false이고 initialValue가 없거나 빈 배열이면, 최소 하나의 빈 그룹 생성
  // initialValue가 있을 때도 config의 설정(textarea 등)을 병합
  const defaultInitialValue = 
    initialValue && initialValue.length > 0
      ? initialValue.map((group) =>
          group.map((item, subIndex) => ({
            ...item,
            // config의 설정을 병합하여 textarea prop 보장
            textarea: config.inputs[subIndex]?.textarea ?? item.textarea,
          }))
        )
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

  // input 클릭/포커스 시 드롭다운 표시
  const handleInputFocus = () => {
    if (dropdownInputConfig && tableData.length > 0) {
      if (onlyOne) {
        // 단일 선택 드롭다운에서는 모든 옵션을 표시 (선택된 값 포함)
        setSuggestions(tableData);
      } else {
        // 복수 선택 드롭다운에서는 이미 선택된 값들을 제외한 옵션 표시
        const selectedValues = new Set(
          inputs
            .flat()
            .map((item) => item.value)
            .filter(Boolean),
        );
        const filtered = tableData.filter((item) => {
          const itemValue = item[dropdownInputConfig.valueColumnName] as string;
          return !selectedValues.has(String(itemValue));
        });
        setSuggestions(filtered);
      }
      setShowSuggestions(true);
    }
  };

  // 추천 필터링 함수
  const handleInputChange = (value: string) => {
    if (dropdownInputConfig && tableData.length > 0) {
      // onlyOne일 때 빈 값이면 모든 옵션 표시 (단일 선택 드롭다운)
      if (onlyOne && value === '') {
        setSuggestions(tableData);
        setShowSuggestions(true);
        return;
      }

      // 입력값으로 필터링
      const filtered = tableData.filter((item) => {
        const itemName = (
          item[dropdownInputConfig.nameColumnName] as string
        )?.toLowerCase();
        return itemName?.includes(value.toLowerCase());
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
        // 삭제 후 드롭다운 열기
        if (dropdownInputConfig && handleInputFocus) {
          setTimeout(() => {
            handleInputFocus();
          }, 0);
        }
      }
      return;
    }
    
    dispatch({ type: 'DELETE_INPUT', index });
    
    // 복수 드롭다운에서 삭제 후 드롭다운 열기
    if (dropdownInputConfig && tableData.length > 0) {
      setTimeout(() => {
        // 삭제 후 남은 항목들 중에서 선택된 값들 추출
        const remainingInputs = inputs.filter((_, i) => i !== index);
        const selectedValues = new Set(
          remainingInputs
            .flat()
            .map((item) => item.value)
            .filter(Boolean),
        );
        const filtered = tableData.filter((item) => {
          const itemValue = item[dropdownInputConfig.valueColumnName] as string;
          return !selectedValues.has(String(itemValue));
        });
        setSuggestions(filtered);
        setShowSuggestions(true);
      }, 0);
    }
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
                // config의 설정을 병합하여 textarea prop 보장
                textarea: config.inputs[subIndex]?.textarea ?? item.textarea,
                mode: isReadOnly ? 'read' : item.mode || 'write',
                onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
