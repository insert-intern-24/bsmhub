import React, { useState, useEffect } from 'react';
import Search from './search/Search';
import Tag from './tag/Tag';
import {
  SearchQuery,
  Projects,
  Topics,
  Sort,
} from '@/app/models/projectSearch';
import { createClient } from '@/utils/supabase/client';

export default function Filter({
  setProjects,
  sort,
}: {
  setProjects: React.Dispatch<React.SetStateAction<Projects>>;
  sort: Sort;
}) {
  const [searchQuery, setSearchQuery] = useState<SearchQuery>({});

  useEffect(() => {
    const fetchProjects = async () => {
      const supabase = createClient();
      let query = supabase
        .schema('project')
        .from('projects')
        .select('*, category_id!inner(*)');

      if (searchQuery.inputQuery) {
        query = query.textSearch('project_name', searchQuery.inputQuery);
      }
      if (searchQuery.selectedTags) {
        const categoryTags = searchQuery.selectedTags
          .filter((tag: Topics) => tag.id === 'category_id')
          .map((tag: Topics) => tag.value);

        const statusTags = searchQuery.selectedTags
          .filter((tag: Topics) => tag.id === 'status')
          .map((tag: Topics) => tag.value);

        if (categoryTags.length > 0) {
          query = query.in('category_id', categoryTags);
        }
        if (statusTags.length > 0) {
          query = query.in('status', statusTags);
        }
      }

      if (sort === 'Sort') {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching search results:', error);
        return;
      } else {
        setProjects(data);
      }
    };

    fetchProjects();
  }, [searchQuery, sort]);

  return (
    <>
      <div className="w-[86.625rem] flex p-10 flex-col items-start gap-6 self-stretch rounded-xl border border-[#DADADA] bg-white">
        <Search setSearchQuery={setSearchQuery} searchQuery={searchQuery} />
        <Tag searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>
    </>
  );
}
