import { FormConfig } from '@/app/components/ui/input/types/inputTypes';
import { createClient } from '@/services/supabase/client';
import {
  createDataTransformer,
  createDeleteFilterGenerator,
  createChangeCalculator,
  processGraphQLRelationTables,
} from '@/services/graphQL/relationTableHelper.graphql';
import { getSelectableProfilesByStudentId, getProfileById } from '@/services/profile/getProfileApi.client';
import { z } from 'zod';

export const projectConfig: FormConfig = {
  redirect: {
    buildPath: async (formData, mode, variables) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('[projectConfig.redirect] buildPath called', { formData, mode, variables });
      }

      // project_name: [[{ value: '프로젝트명' }]]
      const nameData = formData.project_name as unknown[][];
      const projectName = (nameData?.[0]?.[0] as { value?: string })?.value;
      if (process.env.NODE_ENV === 'development') {
        console.log('[projectConfig.redirect] projectName:', projectName);
      }

      // project_owner: [[{ value: 'profile_id' }]] - dropdownInputList도 value 필드 사용
      const ownerData = formData.project_owner as unknown[][];
      const ownerId = (ownerData?.[0]?.[0] as { value?: string })?.value;
      if (process.env.NODE_ENV === 'development') {
        console.log('[projectConfig.redirect] ownerId:', ownerId);
      }

      if (projectName && ownerId) {
        // owner의 프로필 정보 조회하여 개인/팀 구분
        try {
          const profileInfo = await getProfileById(ownerId);
          if (process.env.NODE_ENV === 'development') {
            console.log('[projectConfig.redirect] profileInfo:', profileInfo);
          }

          if (profileInfo) {
            const basePath = profileInfo.is_team ? '/team' : '/portfolio';
            const encodedProfileName = encodeURIComponent(profileInfo.profile_name);
            const encodedProjectName = encodeURIComponent(projectName);
            const redirectPath = `${basePath}/${encodedProfileName}/${encodedProjectName}`;
            if (process.env.NODE_ENV === 'development') {
              console.log('[projectConfig.redirect] redirectPath:', redirectPath);
            }
            return redirectPath;
          } else {
            console.error('[projectConfig.redirect] Profile not found for ownerId:', ownerId);
          }
        } catch (error) {
          console.error('[projectConfig.redirect] Error getting profile info:', error);
        }
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[projectConfig.redirect] Missing projectName or ownerId');
        }
      }
      return null;
    },
    deletePath: () => {
      // URL에서 프로필 페이지 경로 추출
      const pathParts = window.location.pathname.split('/').filter(Boolean);
      // pathParts: ['portfolio' | 'team', profileName, projectName]
      if (pathParts.length >= 2) {
        const basePath = pathParts[0]; // 'portfolio' 또는 'team'
        const profileName = pathParts[1];
        return `/${basePath}/${profileName}`;
      }
      return '/project';
    },
  },
  deleteable: true,
  graphql: {
    read: `
      query GetProject($project_id: Int!) {
        projectsCollection(filter: { project_id: { eq: $project_id } }) {
          edges {
            node {
              project_id
              project_name
              description
              project_thumbnail
              project_logo
              link
              owner
              category_id
              skills
              status
              project_category {
                category_id
                category_name
              }
              project_linkCollection {
                edges {
                  node {
                    link
                    alt
                  }
                }
              }
              project_skillsCollection {
                edges {
                  node {
                    skill_id
                    skills {
                      skill_id
                      skill_name
                    }
                  }
                }
              }
              project_contributorsCollection {
                edges {
                  node {
                    profile_id
                    description
                    profile {
                      profile_id
                      profile_name
                      profile_image
                    }
                  }
                }
              }
              profile {
                profile_id
                profile_name
              }
            }
          }
        }
      }
    `,
    insert: `
      mutation InsertProject($objects: [projectsInsertInput!]!) {
        insertIntoprojectsCollection(objects: $objects) {
          affectedCount
          records {
            project_id
            project_name
            description
            project_thumbnail
            project_logo
            link
            owner
            category_id
            skills
            status
          }
        }
      }
    `,
    update: `
      mutation UpdateProject($set: projectsUpdateInput!, $filter: projectsFilter!) {
        updateprojectsCollection(set: $set, filter: $filter) {
          affectedCount
          records {
            project_id
            project_name
            description
            project_thumbnail
            project_logo
            link
            owner
            category_id
            skills
            status
          }
        }
      }
    `,
    delete: `
      mutation DeleteProject($filter: projectsFilter!) {
        deleteFromprojectsCollection(filter: $filter) {
          affectedCount
          records {
            project_id
            project_name
          }
        }
      }
    `,
  },
  fields: [
    {
      fieldName: 'project_owner',
      label: '소유자 프로필',
      type: 'dropdownInputList',
      required: true,
      columnInfo: { table: 'projects', column: 'owner' },
      inputConfig: {
        onlyOne: true,
        inputs: [
          {
            name: 'owner',
            placeholder: '소유자 프로필을 선택하세요',
            required: true,
          },
        ],
      },
      dropdownInputConfig: {
        nameColumnName: 'display_name',
        valueColumnName: 'profile_id',
        query: async () => {
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();

          if (!user) {
            return [];
          }

          const profiles = await getSelectableProfilesByStudentId(user.id);
          // display_name 필드 추가 (팀: 또는 개인: 접두사)
          return profiles.map((profile) => ({
            ...profile,
            display_name: `${profile.is_team ? '팀: ' : '개인: '}${profile.profile_name}`,
          }));
        },
      },
    },
    {
      fieldName: 'project_name',
      label: '프로젝트 이름',
      type: 'inputList',
      required: true,
      columnInfo: { table: 'projects', column: 'project_name' },
      inputConfig: {
        onlyOne: true,
        inputs: [
          {
            name: 'name',
            type: 'text',
            placeholder: '프로젝트 이름을 입력하세요',
            required: true,
            zodSchema: z
              .string()
              .min(1)
              .regex(
                /^[가-힣A-Za-z0-9_-]+$/,
                '한글, 영문, 숫자, 언더스코어(_), 하이픈(-)만 사용할 수 있습니다.',
              ),
          },
        ],
      },
    },
    {
      fieldName: 'project_description',
      label: '프로젝트 설명',
      type: 'inputList',
      required: true,
      columnInfo: { table: 'projects', column: 'description' },
      inputConfig: {
        onlyOne: true,
        inputs: [
          {
            name: 'description',
            type: 'text',
            placeholder: '프로젝트 설명을 입력하세요',
            required: true,
          },
        ],
      },
    },
    {
      fieldName: 'project_thumbnail',
      label: '프로젝트 썸네일',
      type: 'picture',
      required: true,
      columnInfo: { table: 'projects', column: 'project_thumbnail' },
      aspectRatio: '16:9',
      bucket: 'project-image',
    },
    {
      fieldName: 'project_logo',
      label: '프로젝트 로고',
      type: 'picture',
      required: false,
      columnInfo: { table: 'projects', column: 'project_logo' },
      aspectRatio: '1:1',
      bucket: 'project-image',
    },
    {
      fieldName: 'project_link',
      label: '링크',
      type: 'inputList',
      required: false,
      columnInfo: { table: 'project_link', column: '*' },
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
      fieldName: 'project_category',
      label: '프로젝트 카테고리',
      type: 'dropdownInputList',
      required: true,
      columnInfo: { table: 'projects', column: 'category_id' },
      inputConfig: {
        onlyOne: true,
        inputs: [
          {
            name: 'category_id',
            placeholder: '카테고리를 선택하세요',
            required: true,
          },
        ],
      },
      dropdownInputConfig: {
        nameColumnName: 'category_name',
        valueColumnName: 'category_id',
        query: async () => {
          const supabase = await createClient();
          const { data, error } = await supabase
            .from('project_category')
            .select('category_id, category_name')
            .order('category_name');
          if (error) {
            console.error('Error fetching project categories:', error);
            return [];
          }
          return data || [];
        },
      },
    },
    {
      fieldName: 'project_status',
      label: '프로젝트 상태',
      type: 'dropdownInputList',
      required: true,
      columnInfo: { table: 'projects', column: 'status' },
      inputConfig: {
        onlyOne: true,
        inputs: [
          {
            name: 'status',
            placeholder: '프로젝트 상태를 선택하세요',
            required: true,
          },
        ],
      },
      dropdownInputConfig: {
        nameColumnName: 'label',
        valueColumnName: 'value',
        query: async () => {
          // 프로젝트 상태 옵션: 0: 진행중, 1: 완료, 2: 중단
          return [
            { value: 0, label: '진행중' },
            { value: 1, label: '완료' },
            { value: 2, label: '중단' },
          ];
        },
      },
    },
    {
      fieldName: 'project_skills',
      label: '기술 스택',
      type: 'skillTag',
      required: false,
      columnInfo: { table: 'project_skills', column: '*' },
      relationHandler: {
        type: 'graphql',
        identifierIsStudentId: false,
        dataTransformer: (data: unknown[]) => {
          // skill_id를 숫자로 유지하는 커스텀 transformer
          return (data as Array<{ skill_id: number }>)
            .filter((item) => Boolean(item.skill_id))
            .map((item) => ({
              skill_id: Number(item.skill_id), // 명시적으로 숫자로 변환
            }));
        },
        deleteFilterGenerator: createDeleteFilterGenerator(['skill_id']),
        changeCalculator: createChangeCalculator(['skill_id']),
      },
      valuePath: 'skill_id',
      white: false,
    },
    // {
    //   fieldName: 'project_html_description',
    //   label: '프로젝트 상세 설명',
    //   type: 'inputList',
    //   required: false,
    //   columnInfo: { table: 'project_html_description', column: '*' },
    //   relationHandler: {
    //     type: 'graphql',
    //     identifierIsStudentId: false,
    //     dataTransformer: createDataTransformer(
    //       { html_content: 'html_content' },
    //       (item) => Boolean(item.html_content),
    //     ),
    //     deleteFilterGenerator: createDeleteFilterGenerator(['html_content']),
    //     changeCalculator: createChangeCalculator(['html_content']),
    //   },
    //   inputConfig: {
    //     onlyOne: true,
    //     inputs: [
    //       {
    //         name: 'html_content',
    //         type: 'text',
    //         placeholder: '프로젝트 상세 설명을 HTML 형식으로 입력하세요',
    //         required: false,
    //       },
    //     ],
    //   },
    // },
    {
      fieldName: 'project_contributors',
      label: '프로젝트 기여자',
      type: 'dropdownInputList',
      required: false,
      columnInfo: { table: 'project_contributors', column: '*' },
      inputConfig: {
        onlyOne: false,
        inputs: [
          {
            name: 'profile_id',
            placeholder: '기여자를 검색하세요',
            required: true,
          },
          {
            name: 'description',
            type: 'text',
            placeholder: '기여 내용을 입력하세요',
            required: false,
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
            .eq('is_team', false)
            .order('profile_name');
          if (error) {
            console.error('Error fetching profiles:', error);
            return [];
          }
          return data || [];
        },
      },
      relationHandler: {
        type: 'graphql',
        identifierIsStudentId: false,
        dataTransformer: createDataTransformer(
          { profile_id: 'profile_id', description: 'description' },
          (item) => Boolean(item.profile_id),
        ),
        // DELETE는 primary key(profile_id)만으로 충분
        deleteFilterGenerator: createDeleteFilterGenerator(['profile_id']),
        // changeCalculator는 description도 비교하여 변경 감지
        changeCalculator: createChangeCalculator(['profile_id', 'description']),
      },
    },
  ],

  /**
   * Project 전용 관계 테이블 처리 핸들러
   */
  afterSave: async ({ recordId, relationTableData, originalRelationData }) => {
    console.log('[projectConfig] afterSave started');
    console.log('[projectConfig] recordId (project_id):', recordId);

    const projectId = recordId as number;

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
      const fieldConfig = projectConfig.fields.find(
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
      projectId,
      'project_id',
      originalRelationData,
    );

    console.log('[projectConfig] afterSave completed');
  },
};
