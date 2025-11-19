'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useToast, type ToastItem } from './ToastContext';
import { Title, Label } from '../ui/text/text';

const TOAST_DURATION = 2000;
const ANIMATION_DURATION = 500;
const DRAG_THRESHOLD = 20;

// Toast 레이아웃 상수 정의
const TOAST_LAYOUT = {
  CONTAINER_WIDTH: 299,
  CONTAINER_HEIGHT: 282,
  CARD_WIDTH: 280,
  CARD_HEIGHT: 197,
  CARD_ROTATION: 359, // 359도로 미세 회전하여 시각적 효과 제공
  CARD_TOP_OFFSET: '10%',
  CARD_BOTTOM_OFFSET: '18%',
  IMAGE_BOTTOM_WIDTH: Math.round(139 * 1.3),
  IMAGE_BOTTOM_HEIGHT: Math.round(200 * 1.3),
  IMAGE_BOTTOM_LEFT: '44%',
  IMAGE_BOTTOM_TOP: '3px',
  IMAGE_TOP_WIDTH: 235,
  IMAGE_TOP_HEIGHT: 119,
  IMAGE_TOP_LEFT: '52%',
  IMAGE_TOP_BOTTOM: '-2%',
} as const;

const Toast = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  const toast = toasts[0];

  return (
    <div
      className="fixed bottom-0 z-[10050] right-[max(calc((100vw-109rem)/2+33px),33px)] mobile:right-[11px]"
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
    </div>
  );
};

export default Toast;

interface ToastItemProps {
  toast: ToastItem;
  onClose: () => void;
}

const ToastItem = ({ toast, onClose }: ToastItemProps) => {
  const [isClosing, setIsClosing] = useState(false);
  const [dragY, setDragY] = useState(0);
  const startY = useRef(0);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    setIsClosing(false);
    setDragY(0);
    
    // 기존 타이머 정리
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    if (animationTimerRef.current) clearTimeout(animationTimerRef.current);
    
    // duration 속성 또는 기본값 사용
    const duration = toast.duration || TOAST_DURATION;
    
    // 지정된 시간 후 애니메이션 시작
    closeTimerRef.current = setTimeout(() => {
      setIsClosing(true);
      // 애니메이션 완료 후 삭제
      animationTimerRef.current = setTimeout(() => {
        onClose();
      }, ANIMATION_DURATION);
    }, duration);
    
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      if (animationTimerRef.current) clearTimeout(animationTimerRef.current);
      // 컴포넌트 언마운트 시 이벤트 리스너 정리
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [toast.id, toast.duration, onClose]);

  const handleClose = () => {
    // 기존 타이머 정리
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    if (animationTimerRef.current) clearTimeout(animationTimerRef.current);
    
    setIsClosing(true);
    // 애니메이션 완료 후 삭제
    animationTimerRef.current = setTimeout(() => {
      onClose();
    }, ANIMATION_DURATION);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    startY.current = e.clientY;
    let currentY = 0;

    const handleMove = (e: MouseEvent) => {
      currentY = e.clientY - startY.current;
      if (currentY > 0) setDragY(currentY);
    };

    const handleUp = () => {
      if (currentY > DRAG_THRESHOLD) {
        handleClose();
      } else {
        setDragY(0);
      }
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      cleanupRef.current = null;
    };

    cleanupRef.current = cleanup;
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' || e.key === 'Enter') {
      handleClose();
    }
  };

  const isErrorWarning = toast.type === 'error' || toast.type === 'warning';
  const bgColor = isErrorWarning ? 'bg-[#ff6c36]' : 'bg-white';
  const titleColor = isErrorWarning ? 'text-white' : 'text-black';
  const messageColor = isErrorWarning ? 'text-[#ffe2d8]' : 'text-gray-600';

  // isClosing 상태일 때도 컴포넌트를 렌더링하여 애니메이션이 보이도록 함
  return (
    <div
      className={`relative cursor-grab select-none ${
        isClosing ? 'animate-slide-down' : 'animate-slide-up'
      }`}
      style={{ 
        height: `${TOAST_LAYOUT.CONTAINER_HEIGHT}px`,
        width: `${TOAST_LAYOUT.CONTAINER_WIDTH}px`,
        transform: dragY > 0 ? `translateY(${dragY}px)` : undefined,
      }}
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="alertdialog"
      aria-label={toast.title || '알림'}
    >
      <Image 
        src="/card/ToastCard/bottom.svg" 
        alt="bottom" 
        width={TOAST_LAYOUT.IMAGE_BOTTOM_WIDTH}
        height={TOAST_LAYOUT.IMAGE_BOTTOM_HEIGHT}
        className="absolute -translate-x-1/2 z-0 !select-none pointer-events-none"
        style={{ 
          left: TOAST_LAYOUT.IMAGE_BOTTOM_LEFT,
          top: TOAST_LAYOUT.IMAGE_BOTTOM_TOP 
        }}
        draggable={false}
        priority
      />

      <div
        className={`absolute left-0 rounded-[5px] flex flex-col gap-[3px] items-start justify-start p-4 overflow-hidden ${bgColor}`}
        style={{
          bottom: TOAST_LAYOUT.CARD_BOTTOM_OFFSET,
          top: TOAST_LAYOUT.CARD_TOP_OFFSET,
          width: `${TOAST_LAYOUT.CARD_WIDTH}px`,
          height: `${TOAST_LAYOUT.CARD_HEIGHT}px`,
          minWidth: `${TOAST_LAYOUT.CARD_WIDTH}px`,
          transform: `rotate(${TOAST_LAYOUT.CARD_ROTATION}deg)`
        }}
      >
        {toast.title && <Title className={titleColor}>{toast.title}</Title>}
        <Label className={messageColor}>{toast.message}</Label>
      </div>

      <Image
        src="/card/ToastCard/top.svg"
        alt="top"
        width={TOAST_LAYOUT.IMAGE_TOP_WIDTH}
        height={TOAST_LAYOUT.IMAGE_TOP_HEIGHT}
        className="absolute -translate-x-1/2 z-10 !select-none pointer-events-none"
        style={{ 
          left: TOAST_LAYOUT.IMAGE_TOP_LEFT,
          bottom: TOAST_LAYOUT.IMAGE_TOP_BOTTOM 
        }}
        draggable={false}
        priority
      />
    </div>
  );
};
