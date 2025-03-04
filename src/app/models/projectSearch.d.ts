import { Database } from '@/utils/supabase/database.types';
import { MergeDeep } from 'type-fest';

export interface SearchQuery {
  inputQuery?: string;
  selectedTags?: Topics[];
}

export interface Topics {
  id: string;
  name: string;
  value: number;
}

export type Project = MergeDeep<
  Database['project']['Tables']['projects']['Row'],
  {
    category_id: Database['project']['Tables']['project_category']['Row'];
  }
>;

export type Projects = Project[];
