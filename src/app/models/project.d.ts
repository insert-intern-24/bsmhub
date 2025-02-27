import { Database } from "@/utils/supabase/database.types";

export type projectType = Database['project']['Tables']['projects']['Row'];
export type categoryType = Database['project']['Tables']['project_category']['Row'];

