import { FormConfig } from '@/app/components/modal/inputs/types/inputTypes';
import { createClient } from '@/utils/supabase/client';
import {
  createDataTransformer,
  createDeleteFilterGenerator,
  createChangeCalculator,
} from '@/utils/graphQL/relationTableHelper';

export const teamProfileConfig: FormConfig = {
  graphql: {
    read: `
      query GetTeamProfile($profile_id: String!) {
        profileCollection(filter: { profile_id: { eq: $profile_id }, is_team: { eq: true } }) {
          edges {
            node {
              profile_id
              profile_name
              profile_image
              description
              owner
              profile_linkCollection {
                edges {
                  node {
                    link
                    alt
                  }
                }
              }
              team_memberCollection {
                edges {
                  node {
                    participant_id
                  }
                }
              }
            }
          }
        }
      }
    `,
    insert: `
      mutation InsertTeamProfile($objects: [profileInsertInput!]!) {
        insertIntoprofileCollection(objects: $objects) {
          affectedCount
          records {
            profile_id
          }
        }
      }
    `,
    update: `
      mutation UpdateTeamProfile($set: profileUpdateInput!, $filter: profileFilter!) {
        updateprofileCollection(set: $set, filter: $filter) {
          affectedCount
          records {
            profile_id
            profile_name
            profile_image
            description
            owner
            is_team
          }
        }
      }
    `,
  },
  fields: [
    {
      fieldName: 'profile_full_name',
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
            required: true,
          },
        ],
      },
    },
    {
      fieldName: 'profile_avatar_url',
      label: '프로필 이미지',
      type: 'picture',
      required: false,
      columnInfo: { table: 'profile', column: 'profile_image' },
      aspectRatio: '1:1',
      bucket: 'profile-image',
    },
    {
      fieldName: 'profile_description',
      label: '자기소개',
      type: 'inputList',
      required: false,
      columnInfo: { table: 'profile', column: 'description' },
      inputConfig: {
        onlyOne: true,
        inputs: [
          {
            name: 'description',
            type: 'text',
            placeholder: '자기소개를 입력하세요',
            required: false,
          },
        ],
      },
    },
    {
      fieldName: 'profile_link',
      label: '링크',
      type: 'inputList',
      required: false,
      columnInfo: { table: 'profile_link', column: '*' },
      relationHandler: {
        type: 'graphql',
        identifierIsStudnetId: false,
        dataTransformer: createDataTransformer(
          { link: 'link', alt: 'alt' },
          (item) => Boolean(item.link),
        ),
        deleteFilterGenerator: createDeleteFilterGenerator(['link', 'alt']),
        changeCalculator: createChangeCalculator(['link', 'alt']),
      },
      inputConfig: {
        onlyOne: false,
        inputs: [
          {
            name: 'link',
            type: 'text',
            placeholder: '링크 URL을 입력하세요',
            required: true,
          },
          {
            name: 'alt',
            type: 'text',
            placeholder: '링크 제목을 입력하세요',
            required: true,
          },
        ],
      },
    },
    {
      fieldName: 'team_members',
      label: '팀원',
      type: 'dropdownInputList',
      required: false,
      inputConfig: {
        inputs: [
          {
            name: 'participant_id',
            placeholder: '팀원을 검색하세요',
            required: true,
          },
        ],
      },
      dropdownInputConfig: {
        nameColumnName: 'profile_name',
        valueColumnName: 'profile_id',
        query: async () => {
          const supabase = await createClient();
          const { data, error } = await supabase
            .from('profile')
            .select('profile_id, profile_name')
            .eq('is_team', false);
          if (error) {
            console.error('Error fetching data:', error);
            return [];
          }
          return data || [];
        },
      },
      columnInfo: { table: 'team_member', column: '*' },
      relationHandler: {
        type: 'graphql',
        identifierIsStudnetId: false,
        dataTransformer: createDataTransformer({
          participant_id: 'participant_id',
        }),
        deleteFilterGenerator: createDeleteFilterGenerator(['participant_id']),
        changeCalculator: createChangeCalculator(['participant_id']),
      },
    },
    // {
    //   fieldName: 'profile_competitions',
    //   label: '수상이력',
    //   type: 'inputList',
    //   required: false,
    //   columnInfo: { table: 'profile_competitions', column: '*' },
    //   relationHandler: {
    //     type: 'rest',
    //     handler: updateProfileCompetitions,
    //     identifierIsStudnetId: false,
    //   },
    //   inputConfig: {
    //     onlyOne: false,
    //     inputs: [
    //       {
    //         name: 'prize',
    //         type: 'text',
    //         placeholder: '수상내역을 입력하세요',
    //         required: true,
    //       },
    //     ],
    //   },
    // },
    // {
    //   fieldName: 'profile_skills',
    //   label: '기술스택',
    //   type: 'skillTag',
    //   required: false,
    //   columnInfo: { table: 'profile_skills', column: '*' },
    //   relationHandler: {
    //     type: 'rest',
    //     handler: updateProfileSkills,
    //     identifierIsStudnetId: false,
    //   },
    //   valuePath: 'skill_id',
    //   white: false,
    // },
  ],

  /**
   * Team Profile 전용 관계 테이블 처리 핸들러
   */
  afterSave: async ({ recordId, relationTableData, originalRelationData }) => {
    console.log('[teamProfileConfig] afterSave started');
    console.log('[teamProfileConfig] recordId (profile_id):', recordId);
    console.log(
      '[teamProfileConfig] relationTableData:',
      Array.from(relationTableData.entries()),
    );

    const profileId = recordId as string;

    // GraphQL로 처리할 테이블들
    const graphqlTables: Array<{
      tableName: string;
      relationData: unknown[];
      dataTransformer?: (data: unknown[]) => unknown[];
      deleteFilterGenerator?: (
        item: Record<string, unknown>,
        identifier: string | number,
        identifierField?: string,
      ) => Record<string, unknown>;
      changeCalculator?: (
        newData: unknown[],
        existingData: Record<string, unknown>[],
      ) => {
        toDelete: Record<string, unknown>[];
        toInsert: Record<string, unknown>[];
      };
    }> = [];

    // fields에서 각 테이블의 설정 정보 가져오기
    for (const [tableName, relationData] of relationTableData) {
      const fieldConfig = teamProfileConfig.fields.find(
        (field) => field.columnInfo?.table === tableName,
      );

      if (fieldConfig?.relationHandler?.type === 'graphql') {
        graphqlTables.push({
          tableName,
          relationData,
          dataTransformer: fieldConfig.relationHandler.dataTransformer,
          deleteFilterGenerator:
            fieldConfig.relationHandler.deleteFilterGenerator,
          changeCalculator: fieldConfig.relationHandler.changeCalculator,
        });
      }
    }

    if (graphqlTables.length === 0) {
      console.log('[teamProfileConfig] No GraphQL tables to process');
      return;
    }

    console.log('[teamProfileConfig] Processing GraphQL tables');

    // Mutation block 구성
    let mutationBlock = 'mutation UpdateRelations(';
    const mutationVariables: Record<string, unknown> = {};
    const selectionFields: string[] = [];

    const processedTables: Array<{
      tableName: string;
      changes: {
        toDelete: Record<string, unknown>[];
        toInsert: Record<string, unknown>[];
      };
    }> = [];

    graphqlTables.forEach(
      ({ tableName, relationData, dataTransformer, changeCalculator }) => {
        const existingData =
          (originalRelationData.get(tableName) as Record<string, unknown>[]) ||
          [];

        // 데이터 변환
        const processedData = dataTransformer
          ? dataTransformer(relationData)
          : relationData;

        // 변경사항 계산
        const changes = changeCalculator
          ? changeCalculator(processedData, existingData)
          : { toDelete: [], toInsert: [] };

        if (changes.toDelete.length > 0 || changes.toInsert.length > 0) {
          processedTables.push({ tableName, changes });
        }
      },
    );

    // Mutation 생성
    processedTables.forEach(({ tableName, changes }, index) => {
      // Delete mutations
      if (changes.toDelete.length > 0) {
        const deleteFilterGen = graphqlTables.find(
          (t) => t.tableName === tableName,
        )?.deleteFilterGenerator;

        changes.toDelete.forEach((item, itemIndex) => {
          const deleteVarName = `${tableName}DeleteFilter${index}_${itemIndex}`;
          mutationBlock += `$${deleteVarName}: ${tableName}Filter!, `;

          const deleteFilter = deleteFilterGen
            ? deleteFilterGen(item, profileId, 'profile_id')
            : { profile_id: { eq: profileId }, ...item };

          mutationVariables[deleteVarName] = deleteFilter;

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
        mutationVariables[insertVarName] = changes.toInsert.map((item) => ({
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

    if (selectionFields.length > 0) {
      mutationBlock = mutationBlock.slice(0, -2) + ') {\n';
      mutationBlock += selectionFields.join('\n  ') + '\n}';

      console.log(
        '[teamProfileConfig] Executing GraphQL mutation:',
        mutationBlock,
      );
      console.log(
        '[teamProfileConfig] Variables:',
        JSON.stringify(mutationVariables, null, 2),
      );

      const { executeMutation } = await import('@/utils/graphQL/client');
      await executeMutation(mutationBlock, mutationVariables);

      console.log('[teamProfileConfig] GraphQL mutation executed successfully');
    }

    console.log('[teamProfileConfig] afterSave completed');
  },
};
