"use client"

import { useEffect } from "react";
// import Detail from '@components/detail/Detail';
import Buttons from "@components/modal/inputsOfModal/Buttons";
import Inputs from "@components/modal/inputsOfModal/SingleInput";
import PictureUpload from "@components/modal/inputsOfModal/PictureUpload";
import LabelInputs from "@components/modal/inputsOfModal/LabelOfInputs";
import InputListProvider from "@components/modal/inputsOfModal/InputListProvider";
import InputOfModal from "@components/modal/inputsOfModal/InputOfModal";
import { FormConfig } from "@components/modal/inputsOfModal/types/inputTypes";
import { useModal } from "@components/modal";

// 폼 설정 예제
const sampleFormConfig: FormConfig = {
  fields: [
    {
      label: "이메일",
      required: true,
      fieldName: "email",
      inputConfig: {
        inputs: [
          { type: 'text', placeholder: '이메일을 입력하세요', name: 'email' }
        ],
        onlyOne: true // 단일 입력만 허용
      }
    },
    {
      label: "경력 사항",
      required: false,
      fieldName: "careers",
      inputConfig: {
        inputs: [
          { type: 'date', width: 30, placeholder: '시작일' },
          { type: 'text', width: 35, placeholder: '회사명' },
          { type: 'text', width: 35, placeholder: '직무' }
        ],
        onlyOne: false // 여러 개 추가 가능
      }
    },
    {
      label: "수상 경력",
      required: false,
      fieldName: "awards",
      inputConfig: {
        inputs: [
          { type: 'date', width: 30, placeholder: '수상일' },
          { type: 'text', width: 70, placeholder: '수상 내용' }
        ],
        onlyOne: false // 여러 개 추가 가능
      }
    },
    {
      label: "프로필 사진",
      required: false,
      fieldName: "profilePicture",
      inputConfig: {
        inputs: [
          { type: 'picture', aspectRatio: '1:1' }
        ],
        onlyOne: true
      }
    },
    {
      label: "프로젝트 이미지",
      required: false,
      fieldName: "projectImages",
      inputConfig: {
        inputs: [
          { type: 'picture', aspectRatio: '16:9' }
                ],
        onlyOne: false // 여러 이미지 추가 가능
      }
    }
  ]
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
        />
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
        <Inputs type="lock" />
        <Inputs type="edit" />
        <PictureUpload aspectRatio="4:3"/>
        <InputListProvider config={{
          inputs: [
            { type: 'date', width: 30 },
            { type: 'text', width: 35, placeholder: '내용을 입력하세요' },
            { type: 'text', width: 35 }
          ]
        }} />

        <InputListProvider config={{
          inputs: [
            { type: 'text', placeholder: '내용을 입력하세요' },
          ]
        }} />
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
    </div>
  );
}
