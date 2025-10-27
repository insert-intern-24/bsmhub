import { FormConfig, ColumnInfo } from '@/app/components/modal/inputs/types/inputTypes';

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
export function getColumnInfoByFieldName(formConfig: FormConfig, fieldName: string): ColumnInfo | undefined {
  const columnInfoMap = extractColumnInfoFromFormConfig(formConfig);
  return columnInfoMap[fieldName];
}
