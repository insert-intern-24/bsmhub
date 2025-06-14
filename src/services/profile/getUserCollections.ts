import { createClient } from '@/utils/supabase/server';

const getUserCollections = async (profile_id: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .schema('collection')
    .from('collections')
    .select('*')
    .eq('owner', profile_id)
    .eq('visibility', 'public');

  if (error) {
    console.error('유저 컬렉션 조회 중 오류');
    return [];
  }

  return data || [];
};

export default getUserCollections;
