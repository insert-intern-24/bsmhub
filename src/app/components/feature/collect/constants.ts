import { TabMode } from '@/app/components/layout/tabs/Tabs';

/**
 * 프로젝트 카테고리 탭 목록
 */
export const PROJECT_TABS: TabMode[] = ['all', 'Web', 'Desktop Utility', 'Mobile'];

/**
 * 팀(동아리) 탭 목록
 */
export const TEAM_TABS: TabMode[] = ['all', 'official', 'general'];

/**
 * 전공 동아리를 나타내는 탭 값
 */
export const OFFICIAL_TAB = 'official' as const;

/**
 * 전체 탭을 나타내는 탭 값
 */
export const ALL_TAB = 'all' as const;
