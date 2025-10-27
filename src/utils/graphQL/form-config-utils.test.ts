#!/usr/bin/env node

/**
 * FormConfig에서 ColumnInfo 추출 기능 테스트
 */

import { profileConfig } from '../../services/config/profileConfig';
import { 
  extractColumnInfoFromFormConfig, 
  getColumnInfoArray, 
  getColumnInfoByFieldName 
} from './form-config-utils';
import { generateGraphQLQuery } from './generateGraphQLQuery';

function testFormConfigUtils() {
  console.log('🧪 FormConfig에서 ColumnInfo 추출 테스트 시작\n');
  
  try {
    // 1. 전체 ColumnInfo 매칭 객체 테스트
    console.log('📝 테스트 1: 전체 ColumnInfo 매칭 객체');
    console.log('=' .repeat(50));
    
    const columnInfoMap = extractColumnInfoFromFormConfig(profileConfig);
    console.log('추출된 ColumnInfo 매칭 객체:');
    console.log(JSON.stringify(columnInfoMap, null, 2));
    console.log('\n');
    
    // 2. ColumnInfo 배열 테스트
    console.log('📝 테스트 2: ColumnInfo 배열');
    console.log('=' .repeat(50));
    
    const columnInfoArray = getColumnInfoArray(profileConfig);
    console.log('추출된 ColumnInfo 배열:');
    console.log(JSON.stringify(columnInfoArray, null, 2));
    console.log('\n');
    
    // 3. 특정 필드명으로 ColumnInfo 조회 테스트
    console.log('📝 테스트 3: 특정 필드명으로 ColumnInfo 조회');
    console.log('=' .repeat(50));
    
    const nameColumnInfo = getColumnInfoByFieldName(profileConfig, 'profiles.full_name');
    const studentNumberColumnInfo = getColumnInfoByFieldName(profileConfig, 'profiles.student_number');
    
    console.log('profiles.full_name의 ColumnInfo:', nameColumnInfo);
    console.log('profiles.student_number의 ColumnInfo:', studentNumberColumnInfo);
    console.log('\n');
    
    // 4. GraphQL 쿼리 생성 테스트
    console.log('📝 테스트 4: FormConfig에서 GraphQL 쿼리 생성');
    console.log('=' .repeat(50));
    
    const query = generateGraphQLQuery(columnInfoArray);
    console.log('생성된 GraphQL 쿼리:');
    console.log(query);
    console.log('\n');
    
    console.log('🎉 모든 테스트 완료!');
    
  } catch (error) {
    console.error('❌ 테스트 중 오류 발생:', error);
    process.exit(1);
  }
}

// 스크립트 실행
if (require.main === module) {
  testFormConfigUtils();
}
