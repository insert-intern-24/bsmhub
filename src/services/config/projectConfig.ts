import { FormConfig } from '@/app/components/modal/inputs/types/inputTypes';
import { createClient } from '@/utils/supabase/client';
import {
  createDataTransformer,
  createDeleteFilterGenerator,
  createChangeCalculator,
} from '@/utils/graphQL/relationTableHelper';

export const projectConfig: FormConfig = {
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
              project_html_descriptionCollection {
                edges {
                  node {
                    html_content
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
  },
  fields: [
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
      label: '프로젝트 링크',
      type: 'inputList',
      required: false,
      columnInfo: { table: 'projects', column: 'link' },
      inputConfig: {
        onlyOne: true,
        inputs: [
          {
            name: 'link',
            type: 'url',
            placeholder: '프로젝트 링크를 입력하세요 (예: https://example.com)',
            required: false,
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
      columnInfo: { table: 'projects', column: 'skills' },
      white: false,
    },
    {
      fieldName: 'project_html_description',
      label: '프로젝트 상세 설명',
      type: 'inputList',
      required: false,
      columnInfo: { table: 'project_html_description', column: '*' },
      relationHandler: {
        type: 'graphql',
        identifierIsStudnetId: false,
        dataTransformer: createDataTransformer(
          { html_content: 'html_content' },
          (item) => Boolean(item.html_content),
        ),
        deleteFilterGenerator: createDeleteFilterGenerator(['html_content']),
        changeCalculator: createChangeCalculator(['html_content']),
      },
      inputConfig: {
        onlyOne: true,
        inputs: [
          {
            name: 'html_content',
            type: 'text',
            placeholder: '프로젝트 상세 설명을 HTML 형식으로 입력하세요',
            required: false,
          },
        ],
      },
    },
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
        identifierIsStudnetId: false,
        dataTransformer: createDataTransformer(
          { profile_id: 'profile_id', description: 'description' },
          (item) => Boolean(item.profile_id),
        ),
        deleteFilterGenerator: createDeleteFilterGenerator([
          'profile_id',
          'description',
        ]),
        changeCalculator: createChangeCalculator(['profile_id', 'description']),
      },
    },
  ],
};



