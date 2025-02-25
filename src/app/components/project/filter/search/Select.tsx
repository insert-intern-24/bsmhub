'use client';
import React from 'react';
import { createClient } from '@/utils/supabase/client';
import SelectBox from './SelectBox';

const topics = [{ name: '생애주기' }, { name: '개발주제' }];

const options = [{ 1: '개발중', 2: '서비스중', 3: '개발완료', 4: '기획중' }];

export default async function Select() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .schema('project')
    .from('project_category')
    .select('*');

  if (error) {
    console.error(error);
    return <div>error</div>;
  } else {
    console.log(data);
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
