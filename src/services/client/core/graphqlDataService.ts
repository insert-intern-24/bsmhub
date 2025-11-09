import {
  FormConfig,
  FormFieldConfig,
} from '@/app/components/modal/inputs/types/inputTypes';
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

        const resp = response as
          | {
              updateprofileCollection?: {
                records?: Array<{ profile_id?: string }>;
              };
            }
          | undefined;
        const profileId =
          resp?.updateprofileCollection?.records?.[0]?.profile_id ||
          (variables?.owner as string | undefined);

        if (profileId) {
          await this.processRelationTables(
            profileId,
            relationTableData,
            formConfig,
            variables,
          );
        } else {
          console.warn('Skipping relation table processing: missing profileId');
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
  }

  /**
   * 캐시된 관계 테이블 데이터 가져오기
   */
  getOriginalRelationData(tableName: string): unknown[] {
    return this.originalRelationData.get(tableName) || [];
  }

  /**
   * 관계 테이블 데이터 처리
   */
  private async processRelationTables(
    profileId: string,
    relationTableData: Map<string, unknown[]>,
    formConfig: FormConfig,
    variables?: Record<string, unknown>,
  ): Promise<void> {
    // REST API로 처리할 테이블들과 GraphQL로 처리할 테이블들을 분리
    const restTables: Array<{
      tableName: string;
      relationData: unknown[];
      fieldConfig: FormFieldConfig;
    }> = [];
    const graphqlTables: Array<{
      tableName: string;
      relationData: unknown[];
      fieldConfig: FormFieldConfig;
    }> = [];

    // formConfig에서 각 필드의 relationHandler 설정을 확인
    for (const [tableName, relationData] of relationTableData) {
      console.log(`Checking relation table: ${tableName}, data:`, relationData);

      const fieldConfig = formConfig.fields.find(
        (field) => field.columnInfo?.table === tableName,
      );

      console.log(
        `Field config for ${tableName}:`,
        fieldConfig?.relationHandler,
      );

      if (fieldConfig?.relationHandler) {
        if (fieldConfig.relationHandler.type === 'rest') {
          restTables.push({ tableName, relationData, fieldConfig });
          console.log(`${tableName} added to REST tables`);
        } else {
          graphqlTables.push({ tableName, relationData, fieldConfig });
          console.log(`${tableName} added to GraphQL tables`);
        }
      } else {
        console.log(`${tableName} has no relationHandler, skipping`);
      }
    }

    // REST API로 처리할 테이블들 먼저 처리 (ID 조회/생성이 필요한 경우)
    for (const { tableName, relationData, fieldConfig } of restTables) {
      try {
        await this.processRestRelationTable(
          tableName,
          relationData,
          fieldConfig,
          profileId,
          variables,
        );
      } catch (error) {
        console.error(`Error processing REST table ${tableName}:`, error);
        // REST 처리 실패는 전체 작업을 중단하지 않음
      }
    }

    // GraphQL로 처리할 테이블들을 mutation block으로 한번에 처리
    if (graphqlTables.length > 0) {
      await this.processGraphQLRelationTables(profileId, graphqlTables);
    }
  }

  /**
   * REST API로 관계 테이블 처리
   */
  private async processRestRelationTable(
    tableName: string,
    relationData: unknown[],
    fieldConfig: FormFieldConfig,
    profileId: string,
    variables?: Record<string, unknown>,
  ): Promise<void> {
    if (!fieldConfig.relationHandler?.handler) {
      console.warn(`No handler specified for REST table ${tableName}`);
      return;
    }

    console.log(`Processing ${tableName} via REST API with handler function`);

    // 핸들러 함수 직접 호출
    const handler = fieldConfig.relationHandler.handler;

    // 기존 데이터 가져오기
    const existingData = this.getOriginalRelationData(tableName);

    // 데이터 변환 (필드 설정에 따라)
    let processedData: unknown[];
    if (fieldConfig.relationHandler?.dataTransformer) {
      processedData = fieldConfig.relationHandler.dataTransformer(relationData);
    } else {
      // 기본 변환 로직 (하위 호환성)
      switch (tableName) {
        case 'profile_skills':
          processedData = (relationData as Array<{ skill_id: number }>)
            .map((item) => item.skill_id)
            .filter(Boolean);
          break;
        case 'student_certificates':
          processedData = (
            relationData as Array<{
              certificate_name?: string;
              certificates?: { certificate_name: string };
            }>
          )
            .map(
              (item) =>
                item.certificate_name || item.certificates?.certificate_name,
            )
            .filter(Boolean);
          break;
        case 'profile_competitions':
          processedData = (relationData as Array<{ prize: string }>)
            .map((item) => item.prize)
            .filter(Boolean);
          break;
        case 'profile_link':
          processedData = (
            relationData as Array<{ link: string; alt?: string }>
          )
            .map((item) => ({
              link: item.link,
              alt: item.alt || '',
            }))
            .filter((item) => item.link);
          break;
        default:
          processedData = relationData;
      }
    }

    // 핸들러 호출
    const targetId = fieldConfig.relationHandler?.identifierIsStudnetId
      ? (variables?.owner as string) || profileId
      : profileId;
    await handler(targetId, processedData, existingData);
  }

  /**
   * GraphQL mutation block으로 여러 관계 테이블 처리
   */
  private async processGraphQLRelationTables(
    profileId: string,
    graphqlTables: Array<{
      tableName: string;
      relationData: unknown[];
      fieldConfig: FormFieldConfig;
    }>,
  ): Promise<void> {
    if (graphqlTables.length === 0) return;

    console.log('Processing GraphQL relation tables with mutation block');

    // Mutation block 구성
    let mutationBlock = 'mutation UpdateRelations(';
    const variables: Record<string, unknown> = {};
    const selectionFields: string[] = [];

    // 각 테이블에 대한 변수와 필드 추가
    const processedTables: Array<{
      tableName: string;
      changes: {
        toDelete: Record<string, unknown>[];
        toInsert: Record<string, unknown>[];
      };
      fieldConfig: FormFieldConfig;
    }> = [];

    graphqlTables.forEach(({ tableName, relationData, fieldConfig }) => {
      console.log(
        `Processing GraphQL table: ${tableName}, data:`,
        relationData,
      );

      // 기존 데이터 가져오기
      const existingData = this.getOriginalRelationData(tableName) as Record<
        string,
        unknown
      >[];
      console.log(`Existing data for ${tableName}:`, existingData);

      // 데이터 변환
      const processedData = fieldConfig.relationHandler?.dataTransformer
        ? fieldConfig.relationHandler.dataTransformer(relationData)
        : relationData;
      console.log(`Processed data for ${tableName}:`, processedData);

      // 변경사항 계산
      const changes = this.calculateRelationChanges(
        tableName,
        processedData,
        existingData,
        fieldConfig,
      );
      console.log(`Changes for ${tableName}:`, changes);

      if (changes.toDelete.length === 0 && changes.toInsert.length === 0) {
        console.log(`No changes for ${tableName}, skipping`);
        return;
      }

      processedTables.push({ tableName, changes, fieldConfig });
    });

    // 실제 mutation 생성은 processedTables를 사용
    processedTables.forEach(({ tableName, changes, fieldConfig }, index) => {
      // Delete mutations (변경사항이 있는 경우에만)
      if (changes.toDelete.length > 0) {
        changes.toDelete.forEach((item, itemIndex) => {
          const deleteVarName = `${tableName}DeleteFilter${index}_${itemIndex}`;
          mutationBlock += `$${deleteVarName}: ${tableName}Filter!, `;

          // 필드 설정에서 삭제 필터 생성 함수 사용
          const deleteFilter = fieldConfig.relationHandler
            ?.deleteFilterGenerator
            ? fieldConfig.relationHandler.deleteFilterGenerator(item, profileId)
            : this.createDeleteFilter(tableName, item, profileId);

          variables[deleteVarName] = deleteFilter;

          const deleteFieldName = `delete${
            tableName.charAt(0).toUpperCase() + tableName.slice(1)
          }${index}_${itemIndex}`;
          selectionFields.push(
            `${deleteFieldName}: deleteFrom${tableName}Collection(filter: $${deleteVarName}) { affectedCount }`,
          );
        });
      }

      // Insert mutations
      if (changes.toInsert.length > 0) {
        const insertVarName = `${tableName}InsertObjects${index}`;
        mutationBlock += `$${insertVarName}: [${tableName}InsertInput!]!, `;
        variables[insertVarName] = changes.toInsert.map((item) => ({
          ...item,
          profile_id: profileId,
        }));

        const insertFieldName = `insert${
          tableName.charAt(0).toUpperCase() + tableName.slice(1)
        }`;
        selectionFields.push(
          `${insertFieldName}: insertInto${tableName}Collection(objects: $${insertVarName}) { affectedCount }`,
        );
      }
    });

    // Mutation이 없으면 실행하지 않음
    if (selectionFields.length === 0) {
      console.log('No mutations to execute');
      return;
    }

    // Mutation block 완성
    mutationBlock = mutationBlock.slice(0, -2) + ') {\n'; // 마지막 ', ' 제거하고 괄호 닫기
    mutationBlock += selectionFields.join('\n  ') + '\n}';

    console.log('Generated GraphQL mutation block:', mutationBlock);
    console.log('Variables:', JSON.stringify(variables, null, 2));

    // Mutation 실행
    console.log('About to execute GraphQL mutation');
    await executeMutation(mutationBlock, variables);
    console.log('GraphQL mutation executed successfully');
  }

  /**
   * 관계 테이블 변경사항 계산 (기존 REST 핸들러 방식)
   */
  private calculateRelationChanges(
    tableName: string,
    newData: unknown[],
    existingData: Record<string, unknown>[],
    fieldConfig: FormFieldConfig,
  ): {
    toDelete: Record<string, unknown>[];
    toInsert: Record<string, unknown>[];
  } {
    const toDelete: Record<string, unknown>[] = [];
    const toInsert: Record<string, unknown>[] = [];

    // 필드 설정에서 변경사항 계산 함수 사용 (있는 경우)
    if (fieldConfig.relationHandler?.changeCalculator) {
      console.log(`Using changeCalculator for ${tableName}`);
      const result = fieldConfig.relationHandler.changeCalculator(
        newData,
        existingData,
      );
      console.log(`changeCalculator result for ${tableName}:`, result);
      return result;
    }

    // 기본 비교 로직 (하위 호환성)
    switch (tableName) {
      case 'profile_link':
        console.log(`Using default logic for profile_link`);
        const existingLinks = existingData as Array<{
          link: string;
          alt: string;
        }>;
        const newLinks = newData as Array<{ link: string; alt: string }>;

        // 삭제할 항목: 기존에 있지만 새로운 데이터에 없는 것
        existingLinks.forEach((existing) => {
          const stillExists = newLinks.some(
            (newItem) =>
              newItem.link === existing.link && newItem.alt === existing.alt,
          );
          if (!stillExists) {
            toDelete.push(existing);
          }
        });

        // 추가할 항목: 새로운 데이터에 있지만 기존에 없는 것
        newLinks.forEach((newItem) => {
          const alreadyExists = existingLinks.some(
            (existing) =>
              existing.link === newItem.link && existing.alt === newItem.alt,
          );
          if (!alreadyExists) {
            toInsert.push(newItem);
          }
        });
        break;

      default:
        // 다른 테이블들은 아직 구현되지 않음
        console.warn(`Change calculation not implemented for ${tableName}`);
        break;
    }

    return { toDelete, toInsert };
  }

  /**
   * 삭제 필터 생성
   */
  private createDeleteFilter(
    tableName: string,
    item: Record<string, unknown>,
    profileId: string,
  ): Record<string, unknown> {
    const filter: Record<string, unknown> = { profile_id: { eq: profileId } };

    // 테이블별로 추가 필터 조건
    switch (tableName) {
      case 'profile_link':
        filter['link'] = { eq: item.link };
        filter['alt'] = { eq: item.alt };
        break;
      case 'profile_skills':
        if (item.skill_id) {
          filter['skill_id'] = { eq: item.skill_id };
        }
        break;
      case 'student_certificates':
        if (item.certificate_id) {
          filter['certificate_id'] = { eq: item.certificate_id };
        }
        break;
      case 'profile_competitions':
        if (item.competition_id) {
          filter['competition_id'] = { eq: item.competition_id };
        }
        break;
    }

    return filter;
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
