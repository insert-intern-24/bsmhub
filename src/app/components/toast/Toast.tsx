'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useToast } from './ToastContext';
import { Title, Label } from '../system/text';

const TOAST_DURATION = 2000;
const ANIMATION_DURATION = 500;
const DRAG_THRESHOLD = 20;

const Toast = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  const toast = toasts[0];

  return (
    <div className="fixed bottom-0 z-[10050] right-[max(calc((100vw-109rem)/2+33px),33px)] mobile:right-[11px]">
      <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
    </div>
  );
};

export default Toast;

interface ToastItemProps {
  toast: {
    id: string;
    title?: string;
    message: string;
    type?: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
  };
  onClose: () => void;
}

const ToastItem = ({ toast, onClose }: ToastItemProps) => {
  const [isClosing, setIsClosing] = useState(false);
  const [dragY, setDragY] = useState(0);
  const startY = useRef(0);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);

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
    };
  }, [toast.id, onClose]);

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
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  };

  const isErrorWarning = toast.type === 'error' || toast.type === 'warning';
  const bgColor = isErrorWarning ? 'bg-[#ff6c36]' : 'bg-white';
  const titleColor = isErrorWarning ? 'text-white' : 'text-black';
  const messageColor = isErrorWarning ? 'text-[#ffe2d8]' : 'text-gray-600';

  return (
    <div
      className={`relative h-[282px] w-[299px] ${
        isClosing ? 'animate-slide-down' : 'animate-slide-up'
      } cursor-grab select-none`}
      style={{ transform: dragY > 0 ? `translateY(${dragY}px)` : undefined }}
      onMouseDown={handleMouseDown}
    >
      <Image 
        src="/card/ToastCard/bottom.svg" 
        alt="bottom" 
        width={Math.round(139 * 1.3)}
        height={Math.round(200 * 1.3)}
        className="absolute left-[44%] top-[3px] -translate-x-1/2 z-0 !select-none pointer-events-none"
        draggable={false}
        priority
      />

      <div
        className={`absolute bottom-[18%] left-0 top-[10%] w-[280px] h-[197px] min-w-[280px] 
                   rotate-[359deg] rounded-[5px] 
                   flex-col gap-[3px] items-start justify-start p-4 overflow-hidden
                   ${bgColor}`}
      >
        <Title className={titleColor}>{toast.title || 'title'}</Title>
        <Label className={messageColor}>{toast.message}</Label>
      </div>

      <Image
        src="/card/ToastCard/top.svg"
        alt="top"
        width={235}
        height={119}
        className="absolute left-[52%] bottom-[-2%] -translate-x-1/2 z-10 !select-none pointer-events-none"
        draggable={false}
        priority
      />
    </div>
  );
};
