import { FormConfig, ColumnInfo } from '@/app/components/modal/inputs/types/inputTypes';
import { MultiInputItem } from '@/utils/hook/useInputList';

/**
 * FormConfig에서 각 필드의 ColumnInfo를 추출하여 매칭 객체를 생성합니다.
 * @param formConfig 폼 설정 객체
 * @returns 필드명을 키로 하고 ColumnInfo를 값으로 하는 객체
 */
export function extractColumnInfoFromFormConfig(formConfig: FormConfig): Record<string, ColumnInfo> {
  const columnInfoMap: Record<string, ColumnInfo> = {};
  
  for (const field of formConfig.fields) {
    // columnInfo가 명시적으로 설정된 경우
    if (field.columnInfo) {
      columnInfoMap[field.fieldName] = field.columnInfo;
    } else {
      // fieldName에서 테이블과 컬럼 정보를 추출
      const [table, column] = field.fieldName.split('.');
      if (table && column) {
        columnInfoMap[field.fieldName] = {
          table,
          column
        };
      }
    }
  }
  
  return columnInfoMap;
}

/**
 * FormConfig에서 ColumnInfo 배열을 추출합니다.
 * @param formConfig 폼 설정 객체
 * @returns ColumnInfo 배열
 */
export function getColumnInfoArray(formConfig: FormConfig): ColumnInfo[] {
  const columnInfoMap = extractColumnInfoFromFormConfig(formConfig);
  return Object.values(columnInfoMap);
}

/**
 * 특정 필드명에 해당하는 ColumnInfo를 가져옵니다.
 * @param formConfig 폼 설정 객체
 * @param fieldName 필드명
 * @returns 해당 필드의 ColumnInfo 또는 undefined
 */
/**
 * DB 데이터를 FormConfig에 따라 모달 초기값 형식으로 변환합니다.
 * 
 * 데이터 구조:
 * - 단일 값 필드 (profiles.full_name): 최상위 데이터에서 직접 추출
 * - 관계 테이블 필드 (profile_links): 배열 데이터에서 각 항목 처리
 * 
 * 변환 규칙:
 * - inputList (onlyOne=true): 단일 값을 [[{ value: string }]] 형식으로 변환
 * - inputList (onlyOne=false): 배열을 각 항목별로 [[{ value: string }]] 형식으로 변환
 * - skillTag: 배열에서 skill_name 또는 name 필드를 string[]로 변환
 * - picture: File 타입으로 변환
 * - checkbox: boolean으로 변환
 * 
 * @param data DB에서 조회한 원본 데이터 (Supabase join 결과)
 * @param formConfig 폼 설정 객체 (필드별 타입과 컬럼 정보 포함)
 * @returns 모달 초기값 형식의 데이터
 */
export function transformDataToInitialValues(
  data: Record<string, unknown>,
  formConfig: FormConfig
): Record<string, MultiInputItem[][] | string[] | boolean | File | null> {
  
  const result: Record<string, MultiInputItem[][] | string[] | boolean | File | null> = {};
  
  for (const field of formConfig.fields) {
    const fieldName = field.fieldName;
    const columnInfo = field.columnInfo;
    
    // 단일 값 필드 (profiles.full_name 형식)
    if (fieldName.includes('.')) {
      let value: unknown = null;
      
      if (columnInfo) {
        // 데이터 구조 자동 감지: 최상위 데이터인지 배열인지 확인
        const tableData = data[columnInfo.table];
        const isTopLevelData = !Array.isArray(tableData);
        
        if (isTopLevelData) {
          // 최상위 데이터에서 직접 컬럼 값 추출
          value = (tableData as Record<string, unknown>)?.[columnInfo.column];
        } else {
          // 배열 데이터에서 첫 번째 항목의 컬럼 값 추출
          const arrayData = tableData as unknown[];
          value = (arrayData as Record<string, unknown>[])?.[0]?.[columnInfo.column];
        }
      }
      
      // 타입별 변환
      if (field.type === 'inputList' && field.inputConfig.onlyOne) {
        result[fieldName] = value ? [[{ value: String(value) }]] : [];
      } else if (field.type === 'picture') {
        result[fieldName] = (value as File | null) || null;
      } else if (field.type === 'checkbox') {
        result[fieldName] = Boolean(value);
      } else {
        result[fieldName] = [];
      }
    } 
    // 관계 테이블 필드 (profile_links 형식)
    else {
      const tableData = data[fieldName] as unknown[];
      
      if (field.type === 'skillTag') {
        // skillTag: 배열에서 skill_name 또는 name 필드 추출
        result[fieldName] = (tableData as Record<string, unknown>[])?.map(item => {
          const skillItem = item as Record<string, unknown>;
          return String(skillItem.skill_name || skillItem.name || '');
        }) || [];
      } else if (field.type === 'inputList') {
        // inputList: inputConfig.inputs의 name에 맞춰 변환
        result[fieldName] = (tableData as Record<string, unknown>[])?.map(item => 
          field.inputConfig.inputs.map(input => {
            const inputItem = item as Record<string, unknown>;
            const fieldName = input.name || '';
            return {
              value: String(inputItem[fieldName] || '')
            };
          })
        ) || [];
      } else {
        result[fieldName] = [];
      }
    }
  }
  
  return result;
}
