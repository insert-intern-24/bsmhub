import { ReactNode } from 'react';

interface SidebarContentLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Sidebar와 컨텐츠 영역을 분리하는 레이아웃 컴포넌트
 * - Sidebar는 고정 width, 컨텐츠는 flex-1로 나머지 공간 차지
 * - 모바일에서는 세로로 배치
 */
const SidebarContentLayout = ({
  sidebar,
  children,
  className = '',
}: SidebarContentLayoutProps) => {
  return (
    <div className={`flex gap-[1.875rem] mobile:flex-col mobile:gap-0 ${className}`}>
      {/* Sidebar 영역 */}
      {sidebar}

      {/* 컨텐츠 영역 */}
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
};

export default SidebarContentLayout;
