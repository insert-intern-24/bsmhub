import { Database } from '@/utils/supabase/database.types';

export type profileType = Database['community']['Tables']['profile']['Row'] | undefined;