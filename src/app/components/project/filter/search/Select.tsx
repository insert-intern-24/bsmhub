'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import SelectBox from './SelectBox';

const topics = [{ name: '생애주기' }, { name: '개발주제' }];

const options = [
  { id: 1, text: '개발중' },
  { id: 2, text: '서비스 중' },
  { id: 3, text: '개발완료' },
  { id: 4, text: '기획중' },
];

interface ProjectCategory {
  category_id: number;
  category_name: string;
}

export default function Select() {
  const [data, setData] = useState<ProjectCategory[]>([]);
  const [error, setError] = useState<string | null>(null);

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
        setData(data);
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
            <span>{topic.name}</span>
            {index === 0 ? (
              <SelectBox options={options} />
            ) : (
              <SelectBox
                data={data.map((item) => ({
                  id: item.category_id,
                  name: item.category_name,
                }))}
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
}
