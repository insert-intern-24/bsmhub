'use client';

import { useEffect, useRef } from 'react';
import { useModal } from './ModalContext';

export const Modal = () => {
  const { isOpen, modalContent, closeModal } = useModal();
  const contentRef = useRef<HTMLDivElement>(null);

  // 모달이 열릴 때 body 스크롤 방지 및 모달 스크롤 초기화
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // 모달이 열릴 때 스크롤을 최상단으로 이동 (렌더링 후 실행을 위해 requestAnimationFrame 사용)
      requestAnimationFrame(() => {
        if (contentRef.current) {
          contentRef.current.scrollTop = 0;
        }
      });
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div 
        ref={contentRef}
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-body">{modalContent}</div>
      </div>
    </div>
  );
};
