import React, { useState, useEffect } from 'react';
import Search from './search/Search';
import Tag from './tag/Tag';
import { SearchQuery, Searchable, Topics, Sort } from '@/app/models/setSearch';
import { createClient } from '@/utils/supabase/client';

export default function Filter({
  setSearch,
  sort,
  setCurrentPage,
  type,
}: {
  setSearch: React.Dispatch<React.SetStateAction<Searchable[]>>;
  sort: Sort;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  type: 'project' | 'team' | 'student';
}) {
  const [searchQuery, setSearchQuery] = useState<SearchQuery>({});

  useEffect(() => {
    const fetchProjects = async () => {
      const supabase = createClient();
      let query;

      if (type === 'project') {
        query = supabase
          .schema('project')
          .from('projects')
          .select('*, category_id!inner(*)');
      } else if (type === 'team') {
        query = supabase
          .schema('profile')
          .from('profile')
          .select('*')
          .eq('isTeam', true);
      }

      if (searchQuery.inputQuery) {
        if (type === 'project') {
          query = query?.ilike('project_name', `%${searchQuery.inputQuery}%`);
        } else if (type === 'team') {
          query = query?.ilike('profile_name', `%${searchQuery.inputQuery}%`);
        }
      }
      if (searchQuery.selectedTags) {
        const categoryTags = searchQuery.selectedTags
          .filter((tag: Topics) => tag.id === 'category_id')
          .map((tag: Topics) => tag.value);

        const statusTags = searchQuery.selectedTags
          .filter((tag: Topics) => tag.id === 'status')
          .map((tag: Topics) => tag.value);

        if (categoryTags.length > 0) {
          query = query?.in('category_id', categoryTags);
        }
        if (statusTags.length > 0) {
          query = query?.in('status', statusTags);
        }
      }

      if (sort === 'Sort') {
        query = query?.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching search results:', error);
        return;
      } else {
        setSearch(data);
      }
    };

    fetchProjects();
    setCurrentPage(1);
  }, [searchQuery, sort, setSearch, setCurrentPage, type]);

  return (
    <>
      <div className="w-full flex p-10 flex-col items-start gap-6 self-stretch rounded-xl border border-[#DADADA] bg-white">
        <Search setSearchQuery={setSearchQuery} searchQuery={searchQuery} />
        <Tag searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>
    </>
  );
}
