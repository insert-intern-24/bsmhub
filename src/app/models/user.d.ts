import { profileType } from '@models/profile';
import { categoryType, projectType } from '@models/project';
import { Collection, Details } from './collection';

export interface UserDataType {
  profile: profileType;
  projects: projectType[];
  categories: categoryType[];
  markdown: string | null;
  details: Details | null;
  collections: Collection[];
}
