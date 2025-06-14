import { profileType } from '@models/profile';
import { ProjectItemsPropsType } from '@models/project';
import { Details } from './collection';

export interface UserDataType {
  profile: profileType;
  projects: ProjectItemsPropsType[];
  markdown: string | null;
  details: Details | null;
  collections: Collection[];
}
