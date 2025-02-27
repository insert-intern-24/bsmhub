import { Database } from "@/utils/supabase/database.types";

export type projectType = Database['project']['Tables']['projects']['Row'];
export type categoryType = Database['project']['Tables']['project_category']['Row'];

export const StatusTag: Record<number, string> = {
  1: "개발중",
  2: "서비스 중",
  3: "개발완료",
  4: "기획중"
}