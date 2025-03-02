import { Database } from '@/utils/supabase/database.types';
import { MergeDeep } from 'type-fest';

export type ProjectItemsPropsType = MergeDeep<
  Database['project']['Tables']['projects']['Row'],
  {
    category_id: Database['project']['Tables']['project_category']['Row'];
  }
>;

export const StatusTag: Record<number, string> = {
  1: '개발중',
  2: '서비스 중',
  3: '개발완료',
  4: '기획중',
};
