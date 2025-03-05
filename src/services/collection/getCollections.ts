'use client';
import { Competition } from "@/app/models/collection";
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
      console.error('컬렉션 조회 중 오류');
      return [];
    }

    const formattedData = data.map((item) => ({
      ...item,
      competition: (item.competition as unknown) as Competition 
    }))

    console.log(formattedData)

    return formattedData || [];
}

export default getCollections