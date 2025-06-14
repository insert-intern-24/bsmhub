import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import SelectBox, { Option } from './SelectBox';
import { SearchQuery } from '@/app/models/projectSearch';

const topics = [
  { id: 'status', name: '생애주기' },
  { id: 'category_id', name: '개발주제' },
];

const options = [
  { text: '개발중', id: 'status', value: 1 },
  { text: '서비스 중', id: 'status', value: 2 },
  { text: '개발완료', id: 'status', value: 3 },
  { text: '기획중', id: 'status', value: 4 },
];

export default function Select({
  setSearchQuery,
}: {
  setSearchQuery: React.Dispatch<React.SetStateAction<SearchQuery>>;
}) {
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Option[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .schema('project')
        .from('project_category')
        .select('*');

      if (error) {
        console.error(error);
        setError(error.message);
      } else {
        console.log(data);
        const formattedData = data.map((item) => ({
          text: item.category_name,
          id: 'category_id',
          value: item.category_id,
        }));
        setData(formattedData);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <div className="flex items-start gap-6">
        {topics.map((topic, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className="text-textBasic text-base font-bold leading-[150%] tracking-normal select-none">
              {topic.name}
            </span>
            {index === 0 ? (
              <SelectBox options={options} setSearchQuery={setSearchQuery} />
            ) : (
              <SelectBox options={data} setSearchQuery={setSearchQuery} />
            )}
          </div>
        ))}
      </div>
    </>
  );
}
