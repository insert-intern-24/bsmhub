import { ReactNode } from 'react';

interface SidebarLayoutProps {
  header?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * 공통 Sidebar 레이아웃 컴포넌트
 * - 고정된 width (21.75rem)
 * - sticky positioning 지원
 * - 모바일 반응형 처리
 */
const SidebarLayout = ({ header, children, className = '' }: SidebarLayoutProps) => {
  return (
    <div
      className={`flex-shrink-0 w-[21.75rem] min-w-[21.75rem] mobile:w-full mobile:min-w-0 ${className}`}
    >
      {/* Header 영역 - 스크롤됨 */}
      {header && <div className="pt-[4.5rem]">{header}</div>}

      {/* Sticky 영역 */}
      <aside className={`sticky top-24 self-start mobile:static ${header ? 'mt-4' : 'pt-[4.5rem]'}`}>
        <div className="flex-col w-full gap-[1.625rem]">{children}</div>
      </aside>
    </div>
  );
};

export default SidebarLayout;
