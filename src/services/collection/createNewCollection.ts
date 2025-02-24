'use server';
import { Database } from '@/utils/supabase/database.types';
import { createClient } from '@/utils/supabase/server';
import getProfileBySession from '../profile/getProfileBySession';

const createNewPCollection = async (
  context: Database['collection']['Tables']['collections']['Insert'],
) => {
  const supabase = await createClient();

  const profileId = await getProfileBySession();
  if (!profileId) {
    throw new Error('사용자의 프로필 정보를 찾을 수 없습니다.');
  }

  console.log('owner 값 (profile id):', profileId);

  const newContext = {
    ...context,
    owner: profileId,
  };

  const { data: collection, error } = await supabase
    .schema('collection')
    .from('collections')
    .insert(newContext)
    .select();

  if (error) {
    throw new Error(`컬렉션 생성 실패: ${error.message}`);
  }

  return collection;
};

export default createNewPCollection;
