#!/usr/bin/env node

/**
 * GraphQL 쿼리 생성기 테스트 스크립트
 * 
 * 사용법:
 * npx tsx src/utils/graphql-query-generator/test.ts
 */

import { generateGraphQLQuery, ColumnInfo } from './generateGraphQLQuery';

function main() {
  console.log('🚀 GraphQL 쿼리 생성기 테스트 시작\n');
  
  try {
    // 테스트 1: 지시사항의 chat_messages 예시
    console.log('📝 테스트 1: Chat Messages 예시');
    console.log('=' .repeat(50));
    
    const chatColumns: ColumnInfo[] = [
      { table: "chat_messages", column: "content" },
      { table: "chat_messages", column: "created_at" },
      { table: "chat_messages", column: "conversation_id" },
      { table: "conversations", column: "conversation_title" }
    ];
    
    const chatQuery = generateGraphQLQuery(chatColumns);
    console.log(chatQuery);
    console.log('\n');
    
    // 테스트 2: 프로젝트 관련 테이블
    console.log('📝 테스트 2: 프로젝트 관련 테이블');
    console.log('=' .repeat(50));
    
    const projectColumns: ColumnInfo[] = [
      { table: "projects", column: "project_name" },
      { table: "projects", column: "description" },
      { table: "projects", column: "created_at" },
      { table: "profile", column: "profile_name" },
      { table: "profile", column: "profile_image" }
    ];
    
    const projectQuery = generateGraphQLQuery(projectColumns);
    console.log(projectQuery);
    console.log('\n');
    
    // 테스트 3: 복잡한 관계 테이블
    console.log('📝 테스트 3: 복잡한 관계 테이블');
    console.log('=' .repeat(50));
    
    const complexColumns: ColumnInfo[] = [
      { table: "community_posts", column: "context" },
      { table: "community_posts", column: "created_at" },
      { table: "profile", column: "profile_name" },
      { table: "profile", column: "profile_image" }
    ];
    
    const complexQuery = generateGraphQLQuery(complexColumns);
    console.log(complexQuery);
    console.log('\n');
    
    console.log('🎉 모든 테스트 완료!');
    
  } catch (error) {
    console.error('❌ 테스트 중 오류 발생:', error);
    process.exit(1);
  }
}

// 스크립트 실행
if (require.main === module) {
  main();
}
