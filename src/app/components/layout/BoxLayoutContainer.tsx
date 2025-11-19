import { ReactNode } from 'react';
import AvatarIcon from '@/app/components/shared/AvatarIcon';

interface BoxLayoutContainerProps {
  /** 프로필 이미지 URL */
  profileImage: string | null;
  /** 사이드바 영역 (Panel 컴포넌트) */
  sidebar?: ReactNode;
  /** 메인 콘텐츠 영역 */
  children: ReactNode;
  /** 컨테이너 추가 클래스명 */
  containerClassName?: string;
  /** 메인 콘텐츠 영역 추가 클래스명 */
  contentClassName?: string;
}

/**
 * Box Layout 공통 컨테이너 컴포넌트
 * ProfileIcon + Sidebar + Main Content 구조를 제공합니다.
 * 
 * @example
 * ```tsx
 * <BoxLayoutContainer
 *   profileImage={profile.profile_image}
 *   sidebar={<TeamSidebar teamDetail={teamDetail} />}
 *   containerClassName="w-full flex-row relative responsive-team"
 * >
 *   <ProjectGrid projects={projects} />
 * </BoxLayoutContainer>
 * ```
 */
const BoxLayoutContainer = ({
  profileImage,
  sidebar,
  children,
  containerClassName = '',
  contentClassName = '',
}: BoxLayoutContainerProps) => {
  return (
    <div className={`w-full relative ${containerClassName}`}>
      <AvatarIcon image={profileImage} />
      {sidebar && sidebar}
      <section className={`w-full ${contentClassName}`}>{children}</section>
    </div>
  );
};

export default BoxLayoutContainer;

