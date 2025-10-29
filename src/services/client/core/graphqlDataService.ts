import { FormConfig } from '@/app/components/modal/inputs/types/inputTypes';
import { MultiInputItem } from '@/utils/hook/useInputList';
import { executeQuery, executeMutation } from '@/utils/graphQL/client';
import {
  buildReadQuery,
  buildInsertMutation,
  buildUpdateMutation,
} from '@/utils/graphQL/queryBuilder';
import {
  graphqlToFormData,
  formDataToGraphQL,
} from '@/utils/graphQL/dataTransformer';

/**
 * 작업 결과 타입
 */
export interface Result {
  success: boolean;
  message?: string;
  data?: any;
}

/**
 * 범용 GraphQL 데이터 서비스
 * 사용자 정의 쿼리 실행 + 데이터 매핑만 수행
 */
export class GraphQLDataService {
  /**
   * 데이터 로드
   * @param formConfig - 폼 설정 (사용자 정의 쿼리 포함)
   * @param variables - GraphQL variables
   * @returns React Hook Form 형식의 초기값
   */
  async loadData(
    formConfig: FormConfig,
    variables?: Record<string, any>
  ): Promise<Record<string, MultiInputItem[][] | string[] | boolean | File | null>> {
    try {
      const query = buildReadQuery(formConfig);
      const response = await executeQuery(query, variables);

      console.log('GraphQL Response:', JSON.stringify(response, null, 2));

      // 응답에 여러 컬렉션이 있을 수 있음 (profileCollection, studentCollection 등)
      // 모든 컬렉션을 병합하여 하나의 데이터 객체로 만듦
      const collectionKeys = Object.keys(response).filter(key => key.endsWith('Collection'));

      if (collectionKeys.length === 0) {
        console.warn('No collection found in response');
        return this.getEmptyFormData(formConfig);
      }

      // 첫 번째 컬렉션을 메인 데이터로 사용
      const mainCollectionKey = collectionKeys[0];
      const mainCollection = response[mainCollectionKey];

      if (!mainCollection?.edges || mainCollection.edges.length === 0) {
        console.warn('No data in main collection');
        return this.getEmptyFormData(formConfig);
      }

      // 메인 데이터 노드
      const mainNode = mainCollection.edges[0].node;

      // 다른 컬렉션들의 데이터를 메인 노드에 병합
      for (let i = 1; i < collectionKeys.length; i++) {
        const additionalKey = collectionKeys[i];
        const additionalCollection = response[additionalKey];

        if (additionalCollection?.edges && additionalCollection.edges.length > 0) {
          const additionalNode = additionalCollection.edges[0].node;
          // 추가 컬렉션의 데이터를 메인 노드에 병합
          Object.assign(mainNode, additionalNode);
        }
      }

      console.log('Merged Node Data:', JSON.stringify(mainNode, null, 2));

      // edges 배열을 다시 구성
      const mergedCollectionData = {
        edges: [{ node: mainNode }]
      };

      // GraphQL 응답을 Form 데이터로 변환 (매핑)
      const formData = graphqlToFormData(mergedCollectionData, formConfig);
      console.log('Transformed Form Data:', JSON.stringify(formData, null, 2));

      return formData;
    } catch (error) {
      console.error('Failed to load data:', error);
      throw error;
    }
  }

  /**
   * 데이터 저장
   * @param formConfig - 폼 설정 (사용자 정의 mutation 포함)
   * @param formData - React Hook Form 데이터
   * @param variables - 추가 GraphQL variables (recordId, userId 등)
   * @param isUpdate - 업데이트 여부
   * @returns 작업 결과
   */
  async saveData(
    formConfig: FormConfig,
    formData: Record<string, any>,
    variables?: Record<string, any>,
    isUpdate: boolean = false
  ): Promise<Result> {
    try {
      console.log('Save Data - Form Data:', JSON.stringify(formData, null, 2));

      // Form 데이터를 GraphQL variables로 변환 (매핑)
      const { mainTableData, relationTableData } = formDataToGraphQL(formData, formConfig);
      console.log('Save Data - Transformed Data:', { 
        mainTableData, 
        relationTableData: Array.from(relationTableData.entries()).map(([table, data]) => ({ [table]: data }))
      });

      // 추가 variables 병합 (owner 등)
      const mergedMainData = { ...mainTableData, ...variables };
      console.log('Save Data - Merged Main Data:', JSON.stringify(mergedMainData, null, 2));

      // 사용자 정의 mutation 실행
      const mutation = isUpdate
        ? buildUpdateMutation(formConfig)
        : buildInsertMutation(formConfig);

      console.log('Save Data - Mutation:', mutation.substring(0, 300) + '...');
      console.log('Save Data - Is Update:', isUpdate);

      let finalVariables: Record<string, any>;

      if (isUpdate) {
        // Update: $set과 $filter 형식
        finalVariables = {
          set: mergedMainData,
          filter: { owner: { eq: variables?.owner } }, // owner로 필터링
        };
      } else {
        // Insert: $objects 배열 형식
        finalVariables = {
          objects: [mergedMainData],
        };
      }

      console.log('Save Data - Final Variables:', JSON.stringify(finalVariables, null, 2));

      const response = await executeMutation(mutation, finalVariables);

      console.log('Save Data - Response:', JSON.stringify(response, null, 2));

      // 관계 테이블 데이터 처리 (Update 시에만)
      if (isUpdate && relationTableData.size > 0) {
        console.log('Processing relation tables...');
        
        // 각 관계 테이블에 대해 삭제 후 삽입
        for (const [tableName, relationData] of relationTableData) {
          try {
            // 1. 기존 데이터 삭제
            const deleteMutation = `
              mutation Delete${tableName.charAt(0).toUpperCase() + tableName.slice(1)}($filter: ${tableName}Filter!) {
                deleteFrom${tableName}Collection(filter: $filter) {
                  affectedCount
                }
              }
            `;
            
            const deleteVariables = {
              filter: { profile_id: { eq: response?.updateprofileCollection?.records?.[0]?.profile_id || variables?.owner } }
            };
            
            console.log(`Deleting from ${tableName}:`, deleteVariables);
            await executeMutation(deleteMutation, deleteVariables);
            
            // 2. 새 데이터 삽입 (데이터가 있는 경우에만)
            if (relationData && relationData.length > 0) {
              const insertMutation = `
                mutation Insert${tableName.charAt(0).toUpperCase() + tableName.slice(1)}($objects: [${tableName}InsertInput!]!) {
                  insertInto${tableName}Collection(objects: $objects) {
                    affectedCount
                    records {
                      ${this.getTableIdField(tableName)}
                    }
                  }
                }
              `;
              
              const insertVariables = {
                objects: relationData.map((item: any) => ({
                  ...item,
                  profile_id: response?.updateprofileCollection?.records?.[0]?.profile_id || variables?.owner
                }))
              };
              
              console.log(`Inserting into ${tableName}:`, insertVariables);
              await executeMutation(insertMutation, insertVariables);
            }
          } catch (error) {
            console.error(`Error processing ${tableName}:`, error);
            // 관계 테이블 오류는 메인 업데이트를 막지 않음
          }
        }
      }

      return {
        success: true,
        message: isUpdate ? 'Updated successfully' : 'Inserted successfully',
        data: response,
      };
    } catch (error) {
      console.error('Failed to save data:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * 빈 Form 데이터 생성
   */
  getEmptyFormData(
    formConfig: FormConfig
  ): Record<string, MultiInputItem[][] | string[] | boolean | File | null> {
    const formData: Record<string, MultiInputItem[][] | string[] | boolean | File | null> = {};

    formConfig.fields.forEach((field) => {
      if (field.type === 'checkbox') {
        formData[field.fieldName] = false;
      } else if (field.type === 'picture') {
        formData[field.fieldName] = null;
      } else {
        formData[field.fieldName] = [];
      }
    });

    return formData;
  }

  /**
   * 테이블의 ID 필드명 반환 (실제 데이터베이스 스키마 기반)
   */
  private getTableIdField(tableName: string): string {
    const idFieldMap: Record<string, string> = {
      'profile_link': 'profile_id', // profile_link는 별도 ID 없음, profile_id만 있음
      'profile_skills': 'profile_id', // profile_skills는 별도 ID 없음, profile_id와 skill_id만 있음
      'profile_competitions': 'competition_id', // competition_id가 있음
      'student_certificates': 'certificate_id', // certificate_id가 있음
    };
    
    return idFieldMap[tableName] || `${tableName}_id`;
  }
}

// 싱글톤 인스턴스
let serviceInstance: GraphQLDataService | null = null;

/**
 * GraphQL 데이터 서비스 인스턴스 가져오기
 */
export function getGraphQLDataService(): GraphQLDataService {
  if (!serviceInstance) {
    serviceInstance = new GraphQLDataService();
  }
  return serviceInstance;
}
