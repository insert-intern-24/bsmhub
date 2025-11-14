'use client';

import { useToast } from '@/app/components/toast';
import { Title, Body } from '@/app/components/system/text';

export default function ToastPage() {
  const { showToast } = useToast();

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <Title className="mb-8">Toast 컴포넌트 데모</Title>

      <div className="flex flex-col gap-4">
        <Body className="text-gray-base mb-4">
          아래 버튼을 클릭하여 다양한 타입의 토스트를 확인할 수 있습니다.
        </Body>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => showToast('성공적으로 저장되었습니다.', 'success', 3000, '성공')}
            className="px-4 py-2 rounded-[0.25rem] bg-green-500 text-white hover:bg-green-600 transition-colors"
          >
            Success Toast
          </button>

          <button
            onClick={() => showToast('오류가 발생했습니다. 다시 시도해주세요.', 'error', 3000, '오류')}
            className="px-4 py-2 rounded-[0.25rem] bg-red-primary text-white hover:opacity-90 transition-opacity"
          >
            Error Toast
          </button>

          <button
            onClick={() => showToast('새로운 업데이트가 있습니다.', 'info', 3000, '알림')}
            className="px-4 py-2 rounded-[0.25rem] bg-blue-primary text-white hover:opacity-90 transition-opacity"
          >
            Info Toast
          </button>

          <button
            onClick={() => showToast('주의가 필요한 항목이 있습니다.', 'warning', 3000, '경고')}
            className="px-4 py-2 rounded-[0.25rem] bg-yellow-500 text-white hover:opacity-90 transition-opacity"
          >
            Warning Toast
          </button>

          <button
            onClick={() => {
              showToast('첫 번째 토스트', 'info', 3000, '알림');
              setTimeout(() => showToast('두 번째 토스트', 'success', 3000, '성공'), 500);
              setTimeout(() => showToast('세 번째 토스트', 'warning', 3000, '경고'), 1000);
            }}
            className="px-4 py-2 rounded-[0.25rem] bg-gray-base text-white hover:opacity-90 transition-opacity"
          >
            Multiple Toasts
          </button>
        </div>
      </div>
    </div>
  );
}

