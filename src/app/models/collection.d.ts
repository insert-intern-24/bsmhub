import { Database } from '@/utils/supabase/database.types';
import { MergeDeep } from 'type-fest';

export interface Content {
  value: string | null,
  certified?: boolean | null, // 인증되었는가를 표시함
  address?: string | null // content > value를 클릭할때 이동할 주소
}

export interface Detail {
  label: string,
  symbol?: string | null,
  contents: Content[]
}

export interface Details {
  details? : Detail[] | null
}

export type Collection = MergeDeep<
  Database['collection']['Tables']['collections']['Row'],
  {
    competition?: Database['collection']['Tables']['competition']['Row'] | null;
    details?: Details | null; 
  }
>

export type Competition = Database['collection']['Tables']['competition']['Row'] | null;

export interface CollectionInformation {
  target: string, // 대상
  pax: number, // 인원수
  views: number // 조회수
}

export interface Project {
  type: "project"
  id: number,
  title: string,
  description: string,
  thumbnail?: string | null,
  statement: "개발전" | "개발중" | "개발완료" | "서비스중",
  category: string
  details: Details
}

export type Collections = (Collection | Project)[]

export type DetailBoxType = "col" | "row"