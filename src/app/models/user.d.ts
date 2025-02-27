import { profileType } from "../models/profile"
import { categoryType, projectType } from "../models/project"
import { Details } from "./collection";

export interface userDataType {
  profile: profileType;
  projects: projectType[];
  categories: categoryType[];
  markdown: string | null;
  details: Details | null;
}