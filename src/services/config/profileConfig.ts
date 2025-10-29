import { FormConfig } from '@/app/components/modal/inputs/types/inputTypes';
import { graphqlRelationHandler } from '@/utils/graphQL/handler';
import {
  updateStudentCertificates,
  updateProfileCompetitions,
  updateProfileLinks,
} from '@/utils/graphQL/relationTableHelper';

export const profileConfig: FormConfig = {
  graphql: {
    read: `
      query GetProfile($owner: String!) {
        profileCollection(filter: { owner: { eq: $owner }, is_team: { eq: false } }) {
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
              profile_skillsCollection {
                edges {
                  node {
                    skill_id
                    skills {
                      skill_name
                    }
                  }
                }
              }
              profile_competitionsCollection {
                edges {
                  node {
                    competition_id
                    prize
                  }
                }
              }
            }
          }
        }
        studentCollection(filter: { student_id: { eq: $owner } }) {
          edges {
            node {
              student_certificatesCollection {
                edges {
                  node {
                    certificate_id
                    certificates {
                      certificate_name
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
    insert: `
      mutation InsertProfile($objects: [profileInsertInput!]!) {
        insertIntoprofileCollection(objects: $objects) {
          affectedCount
          records {
            profile_id
          }
        }
      }
    `,
    update: `
      mutation UpdateProfile($set: profileUpdateInput!, $filter: profileFilter!) {
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
    // {
    //   fieldName: 'profile_student_number',
    //   label: '학번',
    //   type: 'inputList',
    //   required: true,
    //   columnInfo: { table: 'student', column: 'student_number' },
    //   inputConfig: {
    //     onlyOne: true,
    //     inputs: [
    //       {
    //         name: 'number',
    //         type: 'text',
    //         placeholder: '학번을 입력하세요',
    //         required: true
    //       }
    //     ]
    //   }
    // },
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
        dataTransformer: (data: unknown[]) =>
          (data as Array<{ link: string; alt?: string }>)
            .map((item) => ({
              link: item.link,
              alt: item.alt || '',
            }))
            .filter((item) => item.link),
        deleteFilterGenerator: (
          item: Record<string, unknown>,
          profileId: string,
        ) => ({
          profile_id: { eq: profileId },
          link: { eq: item.link },
          alt: { eq: item.alt },
        }),
        changeCalculator: (
          newData: unknown[],
          existingData: Record<string, unknown>[],
        ) => {
          console.log('changeCalculator called with:', {
            newData,
            existingData,
          });
          const toDelete: Record<string, unknown>[] = [];
          const toInsert: Record<string, unknown>[] = [];

          const existingLinks = existingData as Array<{
            link: string;
            alt: string;
          }>;
          const newLinks = newData as Array<{ link: string; alt: string }>;

          console.log('existingLinks:', existingLinks);
          console.log('newLinks:', newLinks);

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

          console.log('changeCalculator result:', { toDelete, toInsert });
          return { toDelete, toInsert };
        },
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
      fieldName: 'student_certificates',
      label: '자격증',
      type: 'inputList',
      required: false,
      columnInfo: { table: 'student_certificates', column: '*' },
      relationHandler: {
        type: 'rest',
        handler: updateStudentCertificates,
        identifierIsStudnetId: true,
      },
      inputConfig: {
        onlyOne: false,
        inputs: [
          {
            name: 'certificates.certificate_name',
            type: 'text',
            placeholder: '자격증명을 입력하세요',
            required: true,
          },
        ],
      },
    },
    {
      fieldName: 'profile_competitions',
      label: '수상이력',
      type: 'inputList',
      required: false,
      columnInfo: { table: 'profile_competitions', column: '*' },
      relationHandler: {
        type: 'rest',
        handler: updateProfileCompetitions,
        identifierIsStudnetId: false,
      },
      inputConfig: {
        onlyOne: false,
        inputs: [
          {
            name: 'prize',
            type: 'text',
            placeholder: '수상내역을 입력하세요',
            required: true,
          },
        ],
      },
    },
    {
      fieldName: 'profile_skills',
      label: '기술스택',
      type: 'skillTag',
      required: false,
      columnInfo: { table: 'profile_skills', column: '*' },
      relationHandler: {
        type: 'graphql',
        handler: graphqlRelationHandler,
        identifierIsStudnetId: false,
        config: {
          tableName: 'profile_skills',
          parentIdColumn: 'profile_id',
          relationIdColumn: 'skill_id',
          existingIdField: 'skill_id',
        },
      },
      valuePath: 'skill_id',
      white: false,
    },
  ],
};
