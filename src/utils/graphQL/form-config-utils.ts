import {
  FormConfig,
  ColumnInfo,
  FormFieldConfig,
} from '@/app/components/modal/inputs/types/inputTypes';
import { MultiInputItem } from '@/utils/hook/useInputList';

// 타입 정의
type InitialValue = MultiInputItem[][] | string[] | boolean | File | null;
type InitialValuesMap = Record<string, InitialValue>;

/**
 * FormConfig에서 각 필드의 ColumnInfo를 추출하여 매칭 객체를 생성합니다.
 */
export function extractColumnInfoFromFormConfig(
  formConfig: FormConfig,
): Record<string, ColumnInfo> {
  const columnInfoMap: Record<string, ColumnInfo> = {};

  for (const field of formConfig.fields) {
    if (field.columnInfo) {
      columnInfoMap[field.fieldName] = field.columnInfo;
    }
  }

  return columnInfoMap;
}

/**
 * FormConfig에서 ColumnInfo 배열을 추출합니다.
 */
export function getColumnInfoArray(formConfig: FormConfig): ColumnInfo[] {
  return Object.values(extractColumnInfoFromFormConfig(formConfig));
}

/**
 * 특정 필드명에 해당하는 ColumnInfo를 가져옵니다.
 */
export function getColumnInfoByFieldName(
  formConfig: FormConfig,
  fieldName: string,
): ColumnInfo | undefined {
  const columnInfoMap = extractColumnInfoFromFormConfig(formConfig);
  return columnInfoMap[fieldName];
}

/**
 * 단일 값 필드의 데이터를 추출합니다.
 */
function extractSingleValue(
  data: Record<string, unknown>,
  fieldName: string,
  columnInfo?: ColumnInfo,
): unknown {
  if (!columnInfo) return null;

  // profile 또는 profiles 테이블은 최상위 데이터
  if (columnInfo.table === 'profile' || columnInfo.table === 'profiles') {
    return data[columnInfo.column];
  }

  // 다른 테이블은 배열의 첫 항목
  const tableData = data[columnInfo.table] as
    | Record<string, unknown>[]
    | undefined;
  return tableData?.[0]?.[columnInfo.column] ?? null;
}

/**
 * SkillTag 필드의 데이터를 변환합니다.
 */
function transformSkillTagData(
  tableData: Record<string, unknown>[] | undefined,
): string[] {
  if (!tableData) return [];

  return tableData
    .map((item) => {
      // JOIN된 구조에서 skill_name 추출
      const record = item as Record<string, unknown>;
      const skillName =
        (record.skills as Record<string, unknown> | undefined)?.skill_name ||
        (record.skill_name as string | undefined) ||
        (record.name as string | undefined) ||
        '';
      return String(skillName);
    })
    .filter((name) => name.trim() !== '');
}

/**
 * InputList 필드의 데이터를 변환합니다.
 */
function transformInputListData(
  tableData: Record<string, unknown>[] | undefined,
  field: Extract<FormFieldConfig, { type: 'inputList' }>,
): MultiInputItem[][] {
  if (!tableData) return [];

  return tableData.map((item) =>
    field.inputConfig.inputs.map((input) => {
      let value = '';

      // JOIN된 구조에서 값 추출 (예: certificates.certificate_name)
      if (input.name && input.name.includes('.')) {
        const [tableName, columnName] = input.name.split('.');
        const nested = (item as Record<string, unknown>)[
          tableName
        ] as Record<string, unknown> | undefined;
        value = (nested?.[columnName] as string | undefined) || '';
      } else {
        // 직접 필드 접근
        value = String(
          (item as Record<string, unknown>)[input.name || ''] || '',
        );
      }

      return { value: String(value) };
    }),
  );
}

/**
 * 단일 값 필드를 변환합니다.
 */
function transformSingleValueField(
  field: FormFieldConfig,
  value: unknown,
): InitialValue {
  switch (field.type) {
    case 'inputList':
      if (field.inputConfig.onlyOne) {
        return value ? [[{ value: String(value) }]] : [];
      }
      return [];

    case 'picture':
      return (value as File | null) || null;

    case 'checkbox':
      return Boolean(value);

    default:
      return [];
  }
}

/**
 * 관계 테이블 필드를 변환합니다.
 */
function transformRelationField(
  field: FormFieldConfig,
  tableData: Record<string, unknown>[] | undefined,
): InitialValue {
  switch (field.type) {
    case 'skillTag':
      return transformSkillTagData(tableData);

    case 'inputList':
      return transformInputListData(tableData, field);

    default:
      return [];
  }
}

/**
 * DB 데이터를 FormConfig에 따라 모달 초기값 형식으로 변환합니다.
 */
export function transformDataToInitialValues(
  data: Record<string, unknown>,
  formConfig: FormConfig,
): InitialValuesMap {
  const result: InitialValuesMap = {};

  for (const field of formConfig.fields) {
    const { fieldName, columnInfo } = field;

    // profile 테이블의 단일 값 필드 (columnInfo.table이 'profile' 또는 'profiles')
    if (
      columnInfo &&
      (columnInfo.table === 'profile' || columnInfo.table === 'profiles')
    ) {
      const value = extractSingleValue(data, fieldName, columnInfo);
      result[fieldName] = transformSingleValueField(field, value);
    }
    // 관계 테이블 필드 (profile_link, student_certificates 등)
    else {
      const tableData = data[fieldName] as
        | Record<string, unknown>[]
        | undefined;
      result[fieldName] = transformRelationField(field, tableData);
    }
  }

  console.log('transformDataToInitialValues result:', result);

  return result;
}
