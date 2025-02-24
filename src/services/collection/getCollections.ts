'use server';
import { createClient } from '@/utils/supabase/server';

const getCollectionsByOwner = async (profile_id: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .schema('collection')
    .from('collections')
    .select('*')
    .eq('owner', profile_id);
  if (error) {
    console.error('컬렉션 조회 중 오류');
    return;
  }
  return data || [];
};

export default getCollectionsByOwner;
