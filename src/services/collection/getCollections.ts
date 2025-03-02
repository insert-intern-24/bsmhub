'use client';
import { createClient } from "@/utils/supabase/client";

const getCollections = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .schema('collection')
    .from('collections')
    .select(`
      *,
      competition (*)
    `)
    .eq('visibility', 'public')

    if (error) {
      console.error('컬렉션 조회 중 오류', error);
      return [];
    }

    console.log(data)

    return data || [];
}

export default getCollections