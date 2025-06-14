import { Tables } from '@/utils/supabase/database.types';
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
  Tables<'projects'>,
  {
    category_id: Tables<'project_category'>;
  }
>;

export type Projects = Project[];

export type Sort = 'Sort';
