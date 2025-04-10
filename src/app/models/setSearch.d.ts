import { Database } from '@/utils/supabase/database.types';
import { MergeDeep } from 'type-fest';

export interface Searchable {
  id: string;
  name: string;
}

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
> &
  Searchable;

export type Profile = Database['profile']['Tables']['profile']['Row'] &
  Searchable;

export type Projects = Project[];
export type Profiles = Profile[];

export type Sort = 'Sort';

export type Searchable = Project | Profile;
