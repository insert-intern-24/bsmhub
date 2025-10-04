import { Tables } from '@/utils/supabase/database.types';

type Primitive = string | number | boolean | symbol | bigint | null | undefined;

type MergeDeep<A, B> = A extends Primitive
  ? B
  : B extends Primitive
  ? B
  : B extends Array<unknown>
  ? B
  : A extends Array<unknown>
  ? B
  : {
      [K in keyof (A & B)]: K extends keyof B
        ? K extends keyof A
          ? MergeDeep<A[K], B[K]>
          : B[K]
        : K extends keyof A
        ? A[K]
        : never;
    };

export type ProjectDetailRow = MergeDeep<
  Tables<'projects'>,
  {
    project_markdown: Tables<'project_markdown'> | null;
    project_contributors: Array<
      MergeDeep<
        Tables<'project_contributors'>,
        {
          student: Tables<'student'> | null;
        }
      >
    > | null;
  }
>;

export type ProjectDetailViewModel = {
  id: number;
  title: string;
  shortDescription: string;
  detailDescription: string;
  githubUrl?: string | null;
  iconImage: string;
  youtubeUrl?: string | null;
  technologies: string[];
  team: Array<{
    id: string;
    name: string;
    role: string;
    profileImage: string;
  }>;
};
