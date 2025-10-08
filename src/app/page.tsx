'use client';

import { useEffect } from 'react';
// import Detail from '@components/detail/Detail';
import Buttons from '@components/modal/inputs/Buttons';
import Inputs from '@components/modal/inputs/SingleInput';
import PictureUpload from '@components/modal/inputs/PictureUpload';
import LabelInputs from '@components/modal/inputs/LabelOfInputs';
import InputListProvider from '@components/modal/inputs/InputListProvider';
import InputOfModal from '@components/modal/inputs/InputOfModal';
import { FormConfig } from '@components/modal/inputs/types/inputTypes';
import { useModal } from '@components/modal';
import Checkbox from './components/modal/inputs/Checkbox';
import SkillTagProvider from './components/modal/inputs/SkillTagProvider';

// 폼 설정 예제
const sampleFormConfig: FormConfig = {
  fields: [
    {
      type: 'inputList',
      label: '이메일',
      required: true,
      fieldName: 'email',
      inputConfig: {
        inputs: [
          { type: 'text', placeholder: '이메일을 입력하세요', name: 'email' },
        ],
        onlyOne: true, // 단일 입력만 허용
      },
    },
    {
      type: 'inputList',
      label: '경력 사항',
      required: false,
      fieldName: 'careers',
      inputConfig: {
        inputs: [
          { type: 'date', width: 30, placeholder: '시작일' },
          { type: 'text', width: 35, placeholder: '회사명' },
          { type: 'text', width: 35, placeholder: '직무' },
        ],
        onlyOne: false, // 여러 개 추가 가능
      },
    },
    {
      type: 'inputList',
      label: '수상 경력',
      required: false,
      fieldName: 'awards',
      inputConfig: {
        inputs: [
          { type: 'date', width: 30, placeholder: '수상일' },
          { type: 'text', width: 70, placeholder: '수상 내용' },
        ],
        onlyOne: false, // 여러 개 추가 가능
      },
    },
    {
      type: 'inputList',
      label: '프로필 사진',
      required: false,
      fieldName: 'profilePicture',
      inputConfig: {
        inputs: [{ type: 'picture', aspectRatio: '1:1' }],
        onlyOne: true,
      },
    },
    {
      type: 'inputList',
      label: '프로젝트 이미지',
      required: false,
      fieldName: 'projectImages',
      inputConfig: {
        inputs: [{ type: 'picture', aspectRatio: '16:9' }],
        onlyOne: false, // 여러 이미지 추가 가능
      },
    },
    {
      type: 'skillTag',
      label: '스킬',
      fieldName: 'skills',
      white: false,
    },
    {
      type: 'checkbox',
      label: '동의',
      fieldName: 'agree',
      checkboxLabel: '약관에 동의합니다',
    },
  ],
};

export default function Home() {
  const { openModal } = useModal();

  // 페이지 마운트 시 모달 자동 열기
  useEffect(() => {
    openModal(
      <InputOfModal
        title="프로필 정보 입력"
        config={sampleFormConfig}
        onSubmit={(data: Record<string, unknown>) => {
          console.log('폼 제출 데이터:', data);
          alert('폼이 제출되었습니다! 콘솔을 확인하세요.');
        }}
      />,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 최초 마운트 시에만 실행

  return (
    <div className="bg-white p-10">
      {/* 기존 컴포넌트 테스트 */}
      <div className="mb-10">
        <h2 className="text-2xl mb-4">개별 컴포넌트 테스트</h2>
        <LabelInputs label="이메일" required />
        <Buttons />
        <Inputs type="text" />
        <Inputs type="search" />
        <Inputs type="date" />
        <Inputs type="text" readOnly={true} value="읽기 전용 입력" />
        <Inputs type="edit" />
        <PictureUpload aspectRatio="4:3" />
        <InputListProvider
          config={{
            inputs: [
              { type: 'date', width: 30 },
              { type: 'text', width: 35, placeholder: '내용을 입력하세요' },
              { type: 'text', width: 35 },
            ],
          }}
        />

        <InputListProvider
          config={{
            inputs: [{ type: 'text', placeholder: '내용을 입력하세요' }],
          }}
        />
      </div>

      {/* React Hook Form 통합 폼 */}
      <div className="border-t-2 pt-10">
        <h2 className="text-2xl mb-4">React Hook Form 통합 폼</h2>
        <InputOfModal
          title="프로필 정보 입력"
          config={sampleFormConfig}
          onSubmit={(data: Record<string, unknown>) => {
            console.log('폼 제출 데이터:', data);
            alert('폼이 제출되었습니다! 콘솔을 확인하세요.');
          }}
        />
      </div>

      <Checkbox />

      {/* SkillTagProvider 읽기 전용 화이트 테스트 */}
      <div className="mt-10 p-4 bg-gray-100">
        <h2 className="text-2xl mb-4">SkillTag 읽기 전용 (화이트 배경)</h2>
        <SkillTagProvider
          white={true}
          readOnly={true}
          initialTags={[
            'React',
            'TypeScript',
            'Next.js',
            'Tailwind CSS',
            'Node.js',
            'Python',
          ]}
          onTagsChange={(tags) => console.log('Tags:', tags)}
        />
      </div>

      {/* SkillTagProvider 편집 가능 */}
      <div className="mt-10">
        <h2 className="text-2xl mb-4">SkillTag 편집 가능</h2>
        <SkillTagProvider
          initialTags={['JavaScript', 'HTML', 'CSS']}
          onTagsChange={(tags) => console.log('Tags:', tags)}
        />
      </div>

      <InputListProvider
        config={{
          inputs: [{ type: 'text', placeholder: '내용을 입력하세요' }],
        }}
      />

      {/* 추가 필드 테스트용 config 선언 */}
      {(() => {
        const config: FormConfig = {
          fields: [
            {
              type: 'skillTag',
              label: '스킬',
              fieldName: 'skills',
              white: false,
            },
            {
              type: 'checkbox',
              label: '동의',
              fieldName: 'agree',
              checkboxLabel: '약관에 동의합니다',
            },
          ],
        };
        return (
          <InputOfModal
            title="추가 필드 테스트"
            config={config}
            onSubmit={(data: Record<string, unknown>) => {
              console.log('폼 제출 데이터:', data);
              alert('폼이 제출되었습니다! 콘솔을 확인하세요.');
            }}
          />
        );
      })()}
    </div>
  );
}
