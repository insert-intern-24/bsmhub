# 전역 모달 시스템 사용 가이드

## 개요
Context API를 사용한 전역 모달 관리 시스템입니다. 애플리케이션 어디서든 모달을 쉽게 열고 닫을 수 있습니다.

## 설치 완료된 항목
- ✅ `ModalContext.tsx` - Context 및 Provider
- ✅ `Modal.tsx` - 모달 UI 컴포넌트
- ✅ `modal.css` - 모달 스타일
- ✅ `layout.tsx` - ModalProvider 및 Modal 컴포넌트 통합

## 사용 방법

### 1. 기본 사용법

```tsx
'use client';

import { useModal } from '@/app/components/modal';

export default function MyComponent() {
  const { openModal } = useModal();

  const handleOpenModal = () => {
    openModal(
      <div>
        <h2>모달 제목</h2>
        <p>모달 내용입니다.</p>
      </div>
    );
  };

  return (
    <button onClick={handleOpenModal}>
      모달 열기
    </button>
  );
}
```

### 2. InputsOfModal과 함께 사용

```tsx
'use client';

import { useModal } from '@/app/components/modal';
import InputOfModal from '@/app/components/inputsOfModal/InputOfModal';

export default function ProjectAddButton() {
  const { openModal, closeModal } = useModal();

  const handleAddProject = () => {
    openModal(
      <div className="w-[600px]">
        <h2 className="text-2xl font-bold mb-6">프로젝트 추가</h2>
        <InputOfModal
          onSubmit={(data) => {
            console.log('제출된 데이터:', data);
            closeModal(); // 제출 후 모달 닫기
          }}
          onCancel={closeModal}
        />
      </div>
    );
  };

  return (
    <button onClick={handleAddProject}>
      프로젝트 추가
    </button>
  );
}
```

### 3. 복잡한 폼과 함께 사용

```tsx
'use client';

import { useModal } from '@/app/components/modal';
import { InputListProvider } from '@/app/components/inputsOfModal/InputListProvider';

export default function AdvancedFormButton() {
  const { openModal, closeModal } = useModal();

  const handleOpenForm = () => {
    openModal(
      <div className="w-[800px] max-w-full">
        <h2 className="text-2xl font-bold mb-6">상세 정보 입력</h2>
        <InputListProvider
          inputs={[
            { type: 'text', label: '제목', name: 'title', required: true },
            { type: 'textarea', label: '설명', name: 'description' },
            { type: 'file', label: '이미지', name: 'image' },
          ]}
          onSubmit={(data) => {
            console.log('제출:', data);
            closeModal();
          }}
          onCancel={closeModal}
        />
      </div>
    );
  };

  return (
    <button onClick={handleOpenForm}>
      폼 열기
    </button>
  );
}
```

## 주요 기능

### 1. useModal Hook
```tsx
const { isOpen, modalContent, openModal, closeModal } = useModal();
```

- `isOpen`: 모달이 열려있는지 여부
- `modalContent`: 현재 모달에 표시되는 내용
- `openModal(content)`: 모달을 열고 content를 표시
- `closeModal()`: 모달을 닫음

### 2. 모달 특징
- ✅ ESC 키로 닫기
- ✅ 오버레이 클릭으로 닫기
- ✅ X 버튼으로 닫기
- ✅ 부드러운 애니메이션 (fade in, slide in)
- ✅ 모달 열릴 때 body 스크롤 방지
- ✅ 반응형 디자인 (모바일 최적화)
- ✅ backdrop blur 효과

## 스타일 커스터마이징

`modal.css` 파일에서 다음을 수정할 수 있습니다:
- `.modal-content` - 모달 크기, 여백, 테두리 등
- `.modal-backdrop` - 배경 어둡기, 블러 효과
- `.modal-close-button` - 닫기 버튼 스타일
- 애니메이션 속도 및 효과

## 참고사항

1. **Client Component만 사용 가능**: `'use client'` 지시어가 필요합니다.
2. **중첩 모달**: 현재는 한 번에 하나의 모달만 지원합니다.
3. **접근성**: ESC 키, aria-label 등 기본적인 접근성 지원이 포함되어 있습니다.

## 예시: 전체 플로우

```tsx
'use client';

import { useModal } from '@/app/components/modal';

export default function Example() {
  const { openModal, closeModal } = useModal();

  const openConfirmDialog = () => {
    openModal(
      <div className="text-center p-6">
        <h3 className="text-xl font-bold mb-4">정말 삭제하시겠습니까?</h3>
        <p className="text-gray-600 mb-6">
          이 작업은 되돌릴 수 없습니다.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={closeModal}
            className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            취소
          </button>
          <button
            onClick={() => {
              // 삭제 로직
              console.log('삭제됨');
              closeModal();
            }}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            삭제
          </button>
        </div>
      </div>
    );
  };

  return (
    <button onClick={openConfirmDialog}>
      항목 삭제
    </button>
  );
}
```
