import { PortfolioData } from '@/app/components/portfolio/types';

export interface PaginatedResponse<T> {
  data: T[];
  hasMore: boolean;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export type PaginatedPortfolioResponse = PaginatedResponse<PortfolioData>;
