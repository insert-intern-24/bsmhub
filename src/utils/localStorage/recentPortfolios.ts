import { PortfolioData, PortfolioVisitTrackerData } from '@/app/components/portfolio/types';

const STORAGE_KEY = 'recentPortfolios';
const MAX_ITEMS = 4;

export interface RecentPortfolioItem extends PortfolioData {
  viewedAt: number; // timestamp
}

export interface RecentPortfolioTrackerItem extends PortfolioVisitTrackerData {
  viewedAt: number; // timestamp
}

/**
 * 크기가 제한된 Queue 클래스
 * 최신 항목이 앞에 오고, 크기 초과 시 오래된 항목이 제거됨
 */
class RecentPortfolioQueue {
  private items: RecentPortfolioItem[] = [];

  constructor(items: RecentPortfolioItem[] = []) {
    this.items = items;
  }

  /**
   * 큐의 앞에 항목 추가 (enqueue)
   * 중복 항목이 있으면 제거 후 앞에 추가
   * 크기 초과 시 뒤에서 제거 (dequeue)
   */
  enqueue(item: RecentPortfolioItem): void {
    // 중복 제거
    this.items = this.items.filter(
      (existing) => existing.profile.name !== item.profile.name,
    );

    // 앞에 추가
    this.items.unshift(item);

    // 크기 제한
    if (this.items.length > MAX_ITEMS) {
      this.items = this.items.slice(0, MAX_ITEMS);
    }
  }

  /**
   * 큐의 모든 항목 반환
   */
  toArray(): RecentPortfolioItem[] {
    return [...this.items];
  }

  /**
   * 큐의 크기 반환
   */
  size(): number {
    return this.items.length;
  }
}

/**
 * localStorage에서 최근 본 포트폴리오 목록을 가져옵니다.
 */
export function getRecentPortfolios(): RecentPortfolioItem[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored) as RecentPortfolioItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to get recent portfolios from localStorage:', error);
    return [];
  }
}

/**
 * 포트폴리오를 최근 본 목록에 추가합니다.
 * Queue 방식으로 관리: 중복 제거 후 앞에 추가, 크기 초과 시 뒤에서 제거
 */
export function addRecentPortfolio(portfolioData: PortfolioData): void;
export function addRecentPortfolio(portfolioData: PortfolioVisitTrackerData): void;
export function addRecentPortfolio(portfolioData: PortfolioData | PortfolioVisitTrackerData): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const current = getRecentPortfolios();
    const queue = new RecentPortfolioQueue(current);

    const newItem: RecentPortfolioItem = {
      ...portfolioData,
      viewedAt: Date.now(),
    } as RecentPortfolioItem;

    queue.enqueue(newItem);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue.toArray()));
  } catch (error) {
    console.error('Failed to add recent portfolio to localStorage:', error);
  }
}

/**
 * 최근 본 포트폴리오 목록을 초기화합니다.
 */
export function clearRecentPortfolios(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear recent portfolios from localStorage:', error);
  }
}

