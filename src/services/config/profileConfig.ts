import { FormConfig } from '@/app/components/modal/inputs/types/inputTypes';

export const profileConfig: FormConfig = {
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
      fieldName: 'profiles.student_number',
      label: '학번',
      type: 'inputList',
      required: true,
      columnInfo: { table: 'student', column: 'student_number' },
      inputConfig: {
        onlyOne: true,
        inputs: [
          {
            name: 'number',
            type: 'text',
            placeholder: '학번을 입력하세요',
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
      aspectRatio: '1:1'
    },
    {
      fieldName: 'profiles.bio',
      label: '자기소개',
      type: 'inputList',
      required: false,
      inputConfig: {
        onlyOne: true,
        inputs: [
          {
            name: 'description',
            type: 'text',
            placeholder: '자기소개를 입력하세요',
            required: false
          }
        ]
      }
    },
    {
      fieldName: 'profile_links',
      label: '링크',
      type: 'inputList',
      required: false,
      inputConfig: {
        onlyOne: false,
        inputs: [
          {
            name: 'url',
            type: 'text',
            placeholder: '링크 URL을 입력하세요',
            required: true
          },
          {
            name: 'title',
            type: 'text',
            placeholder: '링크 제목을 입력하세요',
            required: true
          }
        ]
      }
    },
    {
      fieldName: 'profile_certifications',
      label: '자격증',
      type: 'inputList',
      required: false,
      inputConfig: {
        onlyOne: false,
        inputs: [
          {
            name: 'name',
            type: 'text',
            placeholder: '자격증명을 입력하세요',
            required: true
          },
          {
            name: 'issuer',
            type: 'text',
            placeholder: '발급기관을 입력하세요',
            required: true
          },
          {
            name: 'date',
            type: 'text',
            placeholder: '취득일 (YYYY-MM-DD)',
            required: true
          }
        ]
      }
    },
    {
      fieldName: 'profile_awards',
      label: '수상이력',
      type: 'inputList',
      required: false,
      inputConfig: {
        onlyOne: false,
        inputs: [
          {
            name: 'competition',
            type: 'text',
            placeholder: '대회명을 입력하세요',
            required: true
          },
          {
            name: 'rank',
            type: 'text',
            placeholder: '순위를 입력하세요',
            required: true
          },
          {
            name: 'date',
            type: 'text',
            placeholder: '수상일 (YYYY-MM-DD)',
            required: true
          }
        ]
      }
    },
    {
      fieldName: 'profile_skills',
      label: '기술스택',
      type: 'skillTag',
      required: false,
      white: false
    }
  ]
};
