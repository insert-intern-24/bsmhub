import { FormConfig } from '@/app/components/modal/inputs/types/inputTypes';
import { getColumnInfoArray } from './form-config-utils';
import { generateGraphQLQuery } from './generateGraphQLQuery';

/**
 * FormConfig를 사용한 GraphQL 쿼리 생성 예시
 */
export function createGraphQLQueryFromFormConfig(formConfig: FormConfig): string {
  // 1. FormConfig에서 ColumnInfo 배열 추출
  const columnInfoArray = getColumnInfoArray(formConfig);
  
  // 2. GraphQL 쿼리 생성
  const query = generateGraphQLQuery(columnInfoArray);
  
  return query;
}

/**
 * 사용 예시
 */
export function example() {
  // FormConfig 예시 (profileConfig 사용)
  const formConfig: FormConfig = {
    fields: [
      {
        fieldName: 'profiles.full_name',
        label: '이름',
        type: 'inputList',
        required: true,
        columnInfo: { table: 'profile', column: 'profile_name' },
        inputConfig: {
          onlyOne: true,
          inputs: [
            {
              name: 'name',
              type: 'text',
              placeholder: '이름을 입력하세요',
              required: true
            }
          ]
        }
      },
      {
        fieldName: 'profiles.avatar_url',
        label: '프로필 이미지',
        type: 'picture',
        required: false,
        columnInfo: { table: 'profile', column: 'profile_image' },
        bucket: 'profile',
        aspectRatio: '1:1'
      }
    ],
    graphql: {
      read: '',
      insert: '',
      update: ''
    }
  };
  
  // GraphQL 쿼리 생성
  const query = createGraphQLQueryFromFormConfig(formConfig);
  console.log('생성된 GraphQL 쿼리:', query);
  
  return query;
}
