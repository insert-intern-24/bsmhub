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
 * @param data DB에서 조회한 원본 데이터
 * @param formConfig 폼 설정 객체
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
        // profile 또는 profiles 테이블은 최상위 데이터
        if (columnInfo.table === 'profile' || columnInfo.table === 'profiles') {
          value = data[columnInfo.column];
        } else {
          // 다른 테이블은 배열의 첫 항목
          const tableData = data[columnInfo.table] as Record<string, unknown>[];
          value = tableData?.[0]?.[columnInfo.column];
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
      const tableData = data[fieldName] as Record<string, unknown>[];
      
      if (field.type === 'skillTag') {
        // skillTag: 배열에서 skill_name 추출
        result[fieldName] = tableData?.map(item => String(item.skill_name || item.name || '')) || [];
      } else if (field.type === 'inputList') {
        // inputList: inputConfig.inputs의 name에 맞춰 변환
        result[fieldName] = tableData?.map(item => 
          field.inputConfig.inputs.map(input => ({
            value: String(item[input.name || ''] || '')
          }))
        ) || [];
      } else {
        result[fieldName] = [];
      }
    }
  }
  
  return result;
}
