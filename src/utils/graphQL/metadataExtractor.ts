import { FormConfig, ColumnInfo } from '@/app/components/modal/inputs/types/inputTypes';
 

/**
 * 테이블의 메타데이터 정보
 */
export interface TableMetadata {
  tableName: string;
  columns: string[]; // 컬럼 이름 목록
  isRelationTable: boolean;
}

/**
 * FormConfig에서 사용된 모든 테이블과 컬럼 정보를 추출
 */
export function extractMetadata(formConfig: FormConfig): Map<string, TableMetadata> {
  const tablesMap = new Map<string, TableMetadata>();

  // FormConfig의 모든 필드를 순회하며 테이블/컬럼 정보 수집
  formConfig.fields.forEach((field) => {
    if (!field.columnInfo) return;

    const { table, column } = field.columnInfo;

    if (!tablesMap.has(table)) {
      tablesMap.set(table, {
        tableName: table,
        columns: [],
        isRelationTable: isRelationshipTable(table),
      });
    }

    const metadata = tablesMap.get(table)!;

    // column이 '*'이면 해당 테이블의 모든 컬럼을 의미
    if (column === '*') {
      if (!metadata.columns.includes('*')) {
        metadata.columns.push('*');
      }
    } else if (!metadata.columns.includes(column)) {
      metadata.columns.push(column);
    }
  });

  return tablesMap;
}

/**
 * ColumnInfo에서 테이블과 컬럼 분리
 */
export function parseColumnInfo(columnInfo: ColumnInfo): {
  table: string;
  column: string;
} {
  return {
    table: columnInfo.table,
    column: columnInfo.column,
  };
}

/**
 * 특정 테이블이 관계 테이블인지 확인
 * (profile_*, student_* 등 접두사로 판단)
 */
export function isRelationshipTable(tableName: string): boolean {
  const relationshipPrefixes = ['profile_', 'student_', 'team_', 'project_'];
  return relationshipPrefixes.some((prefix) =>
    tableName.startsWith(prefix) && tableName !== prefix.slice(0, -1)
  );
}

/**
 * 관계 테이블에서 부모 테이블 이름 추출
 * 예: profile_link -> profile
 */
export function getParentTableName(relationTableName: string): string {
  const match = relationTableName.match(/^(\w+?)_/);
  return match ? match[1] : relationTableName;
}

/**
 * FormConfig에서 특정 테이블에 대한 필드들 찾기
 */
export function getFieldsByTable(
  formConfig: FormConfig,
  tableName: string
): typeof formConfig.fields {
  return formConfig.fields.filter(
    (field) => field.columnInfo?.table === tableName
  );
}

/**
 * FormConfig에서 주 테이블(main table) 결정
 * 주로 관계 테이블이 아닌 첫 번째 테이블
 */
export function getMainTable(formConfig: FormConfig): string | null {
  for (const field of formConfig.fields) {
    if (field.columnInfo && !isRelationshipTable(field.columnInfo.table)) {
      return field.columnInfo.table;
    }
  }
  return null;
}

/**
 * 테이블 이름에서 외래키 컬럼명 추정
 * 예: profile_link 테이블 -> profile_id
 */
export function getForeignKeyColumn(tableName: string): string {
  const parentTable = getParentTableName(tableName);
  return `${parentTable}_id`;
}
