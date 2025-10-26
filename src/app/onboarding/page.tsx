'use client';

import React, { useState } from 'react';
import { ModalProvider, Modal, useModal } from '@/app/components/modal';
import InputOfModal from '@/app/components/modal/inputs/InputOfModal';
import { FormConfig } from '@/app/components/modal/inputs/types/inputTypes';

function OnboardingContent() {
  const { openModal, closeModal } = useModal();

  const profileConfig: FormConfig = {
    fields: [
      {
        fieldName: 'profileName',
        label: '이름',
        type: 'inputList',
        required: true,
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
        fieldName: 'studentNumber',
        label: '학번',
        type: 'inputList',
        required: true,
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
        fieldName: 'profileImage',
        label: '프로필 이미지',
        type: 'picture',
        required: false,
        aspectRatio: '1:1'
      },
      {
        fieldName: 'bio',
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
        fieldName: 'links',
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
        fieldName: 'certifications',
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
        fieldName: 'awards',
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
        fieldName: 'skills',
        label: '기술스택',
        type: 'skillTag',
        required: false,
        white: false
      }
    ]
  };

  const handleProfileSubmit = (data: any) => {
    console.log('Profile data:', data);
    // TODO: 프로필 데이터를 서버에 저장
    closeModal();
    // 프로필 설정 완료 후 메인 페이지로 이동
    window.location.href = '/';
  };

  // 컴포넌트 마운트 시 모달 자동 열기
  React.useEffect(() => {
    openModal(
      <InputOfModal
        title="프로필 설정"
        config={profileConfig}
        onSubmit={handleProfileSubmit}
        submitButtonText="프로필 저장"
      />
    );
  }, [openModal]);

  return null; // 모달만 표시하므로 아무것도 렌더링하지 않음
}

export default function Onboarding() {
  return (
    <ModalProvider>
      <OnboardingContent />
      <Modal />
    </ModalProvider>
  );
}
