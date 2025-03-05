'use client';
import { Competition, Details } from "@/app/models/collection";
import { createClient } from "@/utils/supabase/client";

const getCollections = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .schema('collection')
    .from('collections')
    .select(`
      *,
      competition (*),
      competition_jurors (*),
      competition_awards (*) 
    `)
    .eq('visibility', 'public')

    if (error) {
      console.error('컬렉션 조회 중 오류', error);
      return [];
    }

    const formattedData = data.map(({ competition_jurors, competition_awards, ...item}) => ({
      ...item,
      competition: (item.competition as unknown) as Competition,
      details: [
        {
          label: '소개',
          contents: [
            {
              value: item.description
            }
          ]
        },
        ...(item.is_competition ? [
              {
                label: '심사위원',
                symbol: 'license',
                contents: competition_jurors.map((juror) => ({
                  value: juror.juror_name,
                  certified: false
                }))
              },
              {
                label: '수상 작품',
                symbol: 'prize',
                contents: competition_awards.map((award) => ({
                  value: award.award_name
                }))
              }
            ] : [])
      ] as Details
    }))

    console.log(formattedData)

    return formattedData || [];
}

export default getCollections