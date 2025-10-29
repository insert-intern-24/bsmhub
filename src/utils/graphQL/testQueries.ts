/**
 * GraphQL 쿼리 테스트용 파일
 * 실제 쿼리가 올바르게 생성되는지 확인
 */

import { profileConfig } from '@/services/config/profileConfig';
import { buildReadQuery, buildInsertMutation, buildUpdateMutation } from './queryBuilder';

// 프로필 조회 쿼리 생성 테스트
console.log('=== Profile Read Query ===');
const readQuery = buildReadQuery(profileConfig, {
  owner: { eq: 'user-123' },
});
console.log(readQuery);

// 프로필 Insert Mutation 테스트
console.log('\n=== Profile Insert Mutation ===');
const insertMutation = buildInsertMutation(profileConfig, {
  profile_name: 'John Doe',
  description: 'Software Engineer',
});
console.log(insertMutation);

// 프로필 Update Mutation 테스트
console.log('\n=== Profile Update Mutation ===');
const updateMutation = buildUpdateMutation(profileConfig, 'profile-123');
console.log(updateMutation);

export { readQuery, insertMutation, updateMutation };
