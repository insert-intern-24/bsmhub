'use client';

import { useEffect } from 'react';
import { addRecentPortfolio } from '@/utils/localStorage/recentPortfolios';
import { PortfolioVisitTrackerData } from '@/app/(box-layout)/portfolio/types';
import { ProfileType } from '@/app/(box-layout)/portfolio/types';
import { CardProps } from '@/app/components/card/project/ProjectCard';
import { convertFromDatabaseImageURL } from '@/services/supabase/imageHostConverter';

interface PortfolioVisitTrackerProps {
  profile: ProfileType;
  personalProjects: CardProps[];
  cooperationProjects: CardProps[];
}

/**
 * 포트폴리오 페이지 방문 시 localStorage에 기록을 저장하는 컴포넌트
 */
const PortfolioVisitTracker = ({
  profile,
  personalProjects,
  cooperationProjects,
}: PortfolioVisitTrackerProps) => {
  useEffect(() => {
    // PortfolioVisitTrackerData 형식으로 변환
    const portfolioData: PortfolioVisitTrackerData = {
      profile: {
        name: profile.profile_name,
        role:
          profile.student?.student_jobs?.map(({ job }) => job.job_name) || [],
        bio: profile.description || '',
        status: '구직 중',
        profile_image: convertFromDatabaseImageURL(profile.profile_image),
      },
      student: profile.student || null,
      projects: [
        ...personalProjects.map((project) => ({
          title: project.title || 'Untitled',
          description: project.description || '',
          logo: '', // CardProps에는 logo가 없으므로 빈 문자열
          projectImage: project.projectImage || '',
        })),
        ...cooperationProjects.map((project) => ({
          title: project.title || 'Untitled',
          description: project.description || '',
          logo: '',
          projectImage: project.projectImage || '',
        })),
      ],
    };

    // localStorage에 저장
    addRecentPortfolio(portfolioData);
  }, [profile, personalProjects, cooperationProjects]);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않음
};

export default PortfolioVisitTracker;

