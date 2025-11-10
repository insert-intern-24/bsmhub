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
  data?: unknown;
}

/**
 * 범용 GraphQL 데이터 서비스
 * 사용자 정의 쿼리 실행 + 데이터 매핑만 수행
 */
export class GraphQLDataService {
  private currentProfileId: string | null = null; // 현재 로드된 프로필 ID 저장
  private originalRelationData: Map<string, unknown[]> = new Map(); // 관계 테이블 데이터 캐시

  /**
   * 캐시된 관계 테이블 데이터를 외부에서 접근할 수 있도록 제공
   */
  getOriginalRelationDataMap(): Map<string, unknown[]> {
    return this.originalRelationData;
  }

  /**
   * 데이터 로드
   * @param formConfig - 폼 설정 (사용자 정의 쿼리 포함)
   * @param variables - GraphQL variables
   * @returns React Hook Form 형식의 초기값
   */
  async loadData(
    formConfig: FormConfig,
    variables?: Record<string, unknown>,
  ): Promise<
    Record<string, MultiInputItem[][] | string[] | boolean | File | null>
  > {
    try {
      const query = buildReadQuery(formConfig);
      const response = await executeQuery<Record<string, unknown>>(
        query,
        variables,
      );

      console.log('GraphQL Response:', JSON.stringify(response, null, 2));

      // 응답에 여러 컬렉션이 있을 수 있음 (profileCollection, studentCollection 등)
      // 모든 컬렉션을 병합하여 하나의 데이터 객체로 만듦
      const collectionKeys = Object.keys(response).filter((key) =>
        key.endsWith('Collection'),
      );

      console.log('Collection Keys found:', collectionKeys);

      if (collectionKeys.length === 0) {
        console.warn('No collection found in response');
        return this.getEmptyFormData(formConfig);
      }

      // 첫 번째 컬렉션을 메인 데이터로 사용
      const mainCollectionKey = collectionKeys[0];
      const mainCollection = (response as Record<string, unknown>)[
        mainCollectionKey
      ] as { edges?: Array<{ node: Record<string, unknown> }> } | undefined;

      console.log(
        `Main Collection (${mainCollectionKey}):`,
        JSON.stringify(mainCollection, null, 2),
      );

      if (!mainCollection?.edges || mainCollection.edges.length === 0) {
        console.warn('No data in main collection');
        return this.getEmptyFormData(formConfig);
      }

      // 메인 데이터 노드
      const mainNode = mainCollection.edges[0].node as Record<string, unknown>;

      // profile_id 저장 (업데이트 시 사용)
      const pid = (mainNode as { profile_id?: unknown }).profile_id;
      if (typeof pid === 'string' && pid) {
        this.currentProfileId = pid;
        console.log('Saved profile_id for updates:', this.currentProfileId);
      }

      // 다른 컬렉션들의 데이터를 메인 노드에 병합
      for (let i = 1; i < collectionKeys.length; i++) {
        const additionalKey = collectionKeys[i];
        const additionalCollection = (response as Record<string, unknown>)[
          additionalKey
        ] as { edges?: Array<{ node: Record<string, unknown> }> } | undefined;

        if (
          additionalCollection?.edges &&
          additionalCollection.edges.length > 0
        ) {
          const additionalNode = additionalCollection.edges[0].node;

          // 중첩된 컬렉션들을 재귀적으로 병합
          // 예: studentCollection 내부의 student_certificatesCollection
          Object.keys(additionalNode).forEach((key) => {
            if (key.endsWith('Collection')) {
              // 컬렉션 데이터를 메인 노드에 추가
              mainNode[key] = additionalNode[key];
            } else if (!mainNode[key]) {
              // 일반 필드는 기존 값이 없을 때만 추가
              mainNode[key] = additionalNode[key];
            }
          });
        }
      }

      console.log('Merged Node Data:', JSON.stringify(mainNode, null, 2));

      // 관계 테이블 데이터 캐싱 (업데이트 시 재사용)
      this.setOriginalRelationData(mainNode);

      // edges 배열을 다시 구성
      const mergedCollectionData = {
        edges: [{ node: mainNode }],
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
    formData: Record<
      string,
      MultiInputItem[][] | string[] | boolean | File | number[] | null | string
    >,
    variables?: Record<string, unknown>,
    isUpdate: boolean = false,
  ): Promise<Result> {
    try {
      console.log('Save Data - Form Data:', JSON.stringify(formData, null, 2));
      console.debug('isUpdate :', isUpdate);

      // Form 데이터를 GraphQL variables로 변환 (매핑)
      const { mainTableData, relationTableData } = formDataToGraphQL(
        formData,
        formConfig,
      );

      // skillTag가 메인 테이블 필드로 사용된 경우 처리 (예: projects.skills)
      const skillKeysToProcess: string[] = [];
      for (const [key, value] of relationTableData.entries()) {
        if (key.startsWith('__skills_')) {
          skillKeysToProcess.push(key);
          const parts = key.replace('__skills_', '').split('_');
          const columnName = parts.slice(1).join('_');
          const skillIds = value as unknown as number[];

          // skill_id 배열을 skill_name 배열로 변환 (기존 함수 재사용)
          const { getSkillNamesByIds } = await import(
            '@/utils/graphQL/relationTableHelper'
          );
          const skillNames = await getSkillNamesByIds(skillIds);

          // 메인 테이블 데이터에 skill_name 배열 저장
          mainTableData[columnName] = skillNames;
        }
      }

      // 처리된 skill 키들을 relationTableData에서 제거
      skillKeysToProcess.forEach((key) => relationTableData.delete(key));

      console.log('Save Data - Transformed Data:', {
        mainTableData,
        relationTableData: Array.from(relationTableData.entries()).map(
          ([table, data]) => ({ [table]: data }),
        ),
      });

      // 사용자 정의 mutation 실행
      const mutation = isUpdate
        ? buildUpdateMutation(formConfig)
        : buildInsertMutation(formConfig);

      console.log('Save Data - Mutation:', mutation.substring(0, 300) + '...');
      console.log('Save Data - Is Update:', isUpdate);

      let finalVariables: Record<string, unknown>;

      if (isUpdate) {
        // Update: $set에는 실제 변경할 필드만 포함 (owner, is_team 제외)
        // owner와 is_team은 filter에만 사용
        const updateSet = { ...mainTableData };

        // 업데이트 시 변경하면 안 되는 필드 제거
        delete updateSet.owner;
        delete updateSet.is_team;
        delete updateSet.project_id;

        console.log(
          'Save Data - Update Set (after filtering):',
          JSON.stringify(updateSet, null, 2),
        );
        console.log(
          'Save Data - Variables for filter:',
          JSON.stringify(variables, null, 2),
        );
        console.log('Save Data - Current profile_id:', this.currentProfileId);

        // 빈 객체인 경우 에러 방지 (변경할 필드가 없으면 업데이트하지 않음)
        if (Object.keys(updateSet).length === 0) {
          console.warn('No fields to update - skipping main table update');
        }

        // 🔥 핵심 수정: profile_id로 필터링 (owner 대신)
        // profile_id가 있으면 사용하고, 없으면 owner 사용
        const filterField = this.currentProfileId
          ? 'profile_id'
          : variables?.project_id
          ? 'project_id'
          : 'owner';
        const filterValue =
          this.currentProfileId || variables?.project_id || variables?.owner;

        console.log(`Using filter: ${filterField} = ${filterValue}`);

        finalVariables = {
          set: updateSet,
          filter: { [filterField]: { eq: filterValue } },
        };
      } else {
        // Insert: $objects에 owner와 is_team 포함 (새로 생성하므로 필요)
        const mergedMainData = { ...mainTableData, ...variables };
        console.log(
          'Save Data - Merged Main Data (Insert):',
          JSON.stringify(mergedMainData, null, 2),
        );

        finalVariables = {
          objects: [mergedMainData],
        };
      }

      console.log(
        'Save Data - Final Variables:',
        JSON.stringify(finalVariables, null, 2),
      );

      // 디버깅: mutation 전체 출력
      console.log('Save Data - Full Mutation:', mutation);

      const response = await executeMutation<unknown>(mutation, finalVariables);

      console.log('Save Data - Response:', JSON.stringify(response, null, 2));

      // 관계 테이블 데이터 처리 (Update 시에만)
      if (isUpdate && relationTableData.size > 0) {
        console.log('Processing relation tables...');

        // FormConfig의 afterSave 콜백이 있으면 호출
        if (formConfig.afterSave) {
          // 응답에서 레코드 ID 추출 (동적으로 처리)
          const recordId = this.extractRecordId(response, variables);

          if (recordId) {
            await formConfig.afterSave({
              recordId,
              relationTableData,
              response,
              variables,
              originalRelationData: this.originalRelationData,
            });
          } else {
            console.warn(
              'Skipping relation table processing: missing recordId',
            );
          }
        } else {
          console.warn(
            'No afterSave handler defined in FormConfig - skipping relation table processing',
          );
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
    formConfig: FormConfig,
  ): Record<string, MultiInputItem[][] | string[] | boolean | File | null> {
    const formData: Record<
      string,
      MultiInputItem[][] | string[] | boolean | File | null
    > = {};

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
   * 기존 관계 테이블 데이터 저장
   * GraphQL 응답에서 관계 테이블 데이터를 추출하여 저장
   */
  private setOriginalRelationData(mainNode: Record<string, unknown>): void {
    this.originalRelationData.clear();

    // profile_skills 캐싱 (skill_id도 함께 저장)
    if (mainNode.profile_skillsCollection) {
      const skillsData = (
        mainNode.profile_skillsCollection as {
          edges: Array<{
            node: { skill_id: number; skills: { skill_name: string } };
          }>;
        }
      ).edges.map((edge) => ({
        skill_id: edge.node.skill_id,
        skill_name: edge.node.skills.skill_name,
      }));
      this.originalRelationData.set('profile_skills', skillsData);
      console.log('Cached profile_skills:', skillsData);
    }

    // student_certificates 캐싱 (certificate_id도 함께 저장)
    if (mainNode.student_certificatesCollection) {
      const certsData = (
        mainNode.student_certificatesCollection as {
          edges: Array<{
            node: {
              certificate_id: number;
              certificates: { certificate_name: string };
            };
          }>;
        }
      ).edges.map((edge) => ({
        certificate_id: edge.node.certificate_id,
        certificate_name: edge.node.certificates.certificate_name,
      }));
      this.originalRelationData.set('student_certificates', certsData);
      console.log('Cached student_certificates:', certsData);
    }

    // profile_competitions 캐싱 (competition_id도 함께 저장)
    if (mainNode.profile_competitionsCollection) {
      const compsData = (
        mainNode.profile_competitionsCollection as {
          edges: Array<{ node: { competition_id: number; prize: string } }>;
        }
      ).edges.map((edge) => ({
        competition_id: edge.node.competition_id,
        prize: edge.node.prize,
      }));
      this.originalRelationData.set('profile_competitions', compsData);
      console.log('Cached profile_competitions:', compsData);
    }

    // profile_link 캐싱
    if (mainNode.profile_linkCollection) {
      const linksData = (
        mainNode.profile_linkCollection as {
          edges: Array<{ node: { link: string; alt: string } }>;
        }
      ).edges.map((edge) => ({ link: edge.node.link, alt: edge.node.alt }));
      this.originalRelationData.set('profile_link', linksData);
      console.log('Cached profile_link:', linksData);
    }
    if (mainNode.team_memberCollection) {
      const membersData = (
        mainNode.team_memberCollection as {
          edges: Array<{ node: { participant_id: string } }>;
        }
      ).edges.map((edge) => ({ participant_id: edge.node.participant_id }));
      this.originalRelationData.set('team_member', membersData);
      console.log('Cached team_member:', membersData);
    }
    if(mainNode.project_contributorsCollection){
      const contributorsData = (
        mainNode.project_contributorsCollection as {
          edges: Array<{ node: { profile_id: string; description: string } }>;
        }
      ).edges.map((edge) => ({
        profile_id: edge.node.profile_id,
        description: edge.node.description,
      }));
      this.originalRelationData.set('project_contributors', contributorsData);
      console.log('Cached project_contributors:', contributorsData);
    }

    // project_link 캐싱
    if (mainNode.project_linkCollection) {
      const projectLinksData = (
        mainNode.project_linkCollection as {
          edges: Array<{ node: { link: string; alt: string | null } }>;
        }
      ).edges.map((edge) => ({ link: edge.node.link, alt: edge.node.alt }));
      this.originalRelationData.set('project_link', projectLinksData);
      console.log('Cached project_link:', projectLinksData);
    }
  }

  /**
   * 캐시된 관계 테이블 데이터 가져오기
   */
  getOriginalRelationData(tableName: string): unknown[] {
    return this.originalRelationData.get(tableName) || [];
  }

  /**
   * GraphQL 응답에서 레코드 ID 추출
   * 다양한 응답 형식을 지원하여 profile_id, project_id 등을 동적으로 추출
   */
  private extractRecordId(
    response: unknown,
    variables?: Record<string, unknown>,
  ): string | number | null {
    // 먼저 캐시된 profile_id가 있으면 사용
    if (this.currentProfileId) {
      return this.currentProfileId;
    }

    // variables에서 project_id 확인
    if (variables?.project_id) {
      return variables.project_id as string | number;
    }

    // variables에서 owner 확인
    if (variables?.owner) {
      return variables.owner as string | number;
    }

    // 응답 객체에서 ID 찾기
    const resp = response as Record<string, unknown> | undefined;
    if (!resp) return null;

    // updateXXXCollection 패턴의 키 찾기
    const updateKey = Object.keys(resp).find(
      (key) => key.startsWith('update') && key.endsWith('Collection'),
    );

    if (updateKey) {
      const collection = resp[updateKey] as
        | {
            records?: Array<Record<string, unknown>>;
          }
        | undefined;

      if (collection?.records && collection.records.length > 0) {
        const record = collection.records[0];
        // profile_id, project_id 등 다양한 ID 필드 지원
        return (record.profile_id || record.project_id || record.id || null) as
          | string
          | number
          | null;
      }
    }

    return null;
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
