import { Database } from '../supabase/database.types';

export interface ColumnInfo {
  table: string;
  column: string;
}

/**
 * 컬럼 정보를 기반으로 GraphQL 쿼리를 자동 생성합니다.
 * @param columns 쿼리 생성을 위한 컬럼 정보 배열
 * @returns 생성된 GraphQL 쿼리 문자열
 */
export function generateGraphQLQuery(columns: ColumnInfo[]): string {
  // 1. 컬럼 정보를 테이블별로 그룹화
  const tableColumns = new Map<string, string[]>();
  for (const column of columns) {
    if (!tableColumns.has(column.table)) {
      tableColumns.set(column.table, []);
    }
    tableColumns.get(column.table)!.push(column.column);
  }

  // 2. 실제 Database 타입에서 테이블 관계 정보 추출
  const relationships = extractTableRelationships();
  
  // 3. 메인 테이블 찾기 (가장 많은 관계를 가진 테이블)
  let mainTable = '';
  let maxRelationships = 0;
  
  for (const tableName of tableColumns.keys()) {
    const tableRels = relationships.get(tableName) || [];
    if (tableRels.length > maxRelationships) {
      maxRelationships = tableRels.length;
      mainTable = tableName;
    }
  }
  
  // 관계가 없으면 첫 번째 테이블을 메인으로 사용
  if (!mainTable) {
    mainTable = Array.from(tableColumns.keys())[0];
  }

  // 4. GraphQL 쿼리 생성
  let query = '{\n';
  query += generateTableQuery(mainTable, tableColumns, relationships, new Set());
  query += '}';
  
  return query;
}

/**
 * 테이블 관계 정보를 정의합니다.
 * database.types.ts에서 확인한 실제 관계 정보를 하드코딩
 */
function extractTableRelationships(): Map<string, any[]> {
  const relationships = new Map<string, any[]>();
  
  // chat_messages -> conversations 관계
  relationships.set('chat_messages', [
    {
      foreignKeyName: "chat_messages_conversation_id_fkey",
      columns: ["conversation_id"],
      referencedRelation: "conversations",
      referencedColumns: ["conversation_id"]
    }
  ]);
  
  // projects -> profile 관계 (owner 필드)
  relationships.set('projects', [
    {
      foreignKeyName: "projects_owner_fkey",
      columns: ["owner"],
      referencedRelation: "profile",
      referencedColumns: ["profile_id"]
    }
  ]);
  
  // community_posts -> profile 관계
  relationships.set('community_posts', [
    {
      foreignKeyName: "community_posts_profile_id_fkey",
      columns: ["profile_id"],
      referencedRelation: "profile",
      referencedColumns: ["profile_id"]
    }
  ]);
  
  return relationships;
}

/**
 * 테이블 쿼리를 재귀적으로 생성합니다.
 */
function generateTableQuery(
  tableName: string, 
  tableColumns: Map<string, string[]>, 
  relationships: Map<string, any[]>,
  processedTables: Set<string>
): string {
  if (processedTables.has(tableName)) return '';
  
  processedTables.add(tableName);
  
  const columns = tableColumns.get(tableName) || [];
  const tableRels = relationships.get(tableName) || [];
  
  let query = `  ${tableName} {\n`;
  
  // 컬럼들 추가
  for (const column of columns) {
    query += `    ${column}\n`;
  }
  
  // 관계된 테이블들 추가
  for (const rel of tableRels) {
    const referencedTable = rel.referencedRelation;
    if (tableColumns.has(referencedTable)) {
      query += generateTableQuery(referencedTable, tableColumns, relationships, processedTables);
    }
  }
  
  query += `  }\n`;
  return query;
}