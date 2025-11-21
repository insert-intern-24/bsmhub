import { FormConfig } from '@/app/components/ui/input/types/inputTypes';
import { createClient } from '@/services/supabase/client';
import {
  createDataTransformer,
  createDeleteFilterGenerator,
  createChangeCalculator,
  processGraphQLRelationTables,
} from '@/services/graphQL/relationTableHelper.graphql';

export const teamProfileConfig: FormConfig = {
  deleteable: true,
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
    delete: `
      mutation DeleteTeamProfile($filter: profileFilter!) {
        deleteFromprofileCollection(filter: $filter) {
          affectedCount
          records {
            profile_id
            profile_name
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
        identifierIsStudentId: false,
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
        identifierIsStudentId: false,
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
    //     identifierIsStudentId: false,
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
    //     identifierIsStudentId: false,
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

    const profileId = recordId as string;

    // GraphQL로 처리할 테이블 정보 수집
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

    // GraphQL 처리
    await processGraphQLRelationTables(
      graphqlTables,
      profileId,
      'profile_id',
      originalRelationData,
    );

    console.log('[teamProfileConfig] afterSave completed');
  },
};
