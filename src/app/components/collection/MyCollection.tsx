'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import CheckBox from './CheckBox';
import add from '@public/images/symbol/add.svg';
import Button from './Button';
import getCollectionsByOwner from '@/services/collection/getCollections';
import getProfileBySession from '@/services/profile/getProfileBySession';
import { Database } from '@/utils/supabase/database.types';

interface Collection {
  id: number;
  name: string;
  isSelected: boolean;
}

const MyCollection: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  // CreateCollectionsForm 으로 연결하면 됨
  const handleAddNewCollection = () => {
    console.log('새 컬렉션 추가하기');
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const entries: { [key: string]: string } = {};
    formData.forEach((value, key) => {
      entries[key] = value.toString();
    });
    console.log('폼 제출 결과:', entries);
  };

  useEffect(() => {
    async function fetchCollections() {
      try {
        const profileId = (await getProfileBySession())?.profile_id;
        if (!profileId) {
          console.error('프로필을 찾을 수 없습니다.');
          return;
        }
        const data = await getCollectionsByOwner(profileId);
        const mapped: Collection[] = data!.map(
          (item: Database['collection']['Tables']['collections']['Row']) => ({
            id: item.collection_id,
            name: item.collection_name,
            isSelected: false,
          }),
        );
        setCollections(mapped);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchCollections();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <form
      onSubmit={handleSubmit}
      className="w-[63.25rem] p-[4rem] bg-white rounded-[0.5rem] flex flex-col gap-[3rem]"
    >
      <h1 className="text-[1.5rem] font-semibold text-titleColor">
        내 컬렉션에 추가
      </h1>
      <div className="space-y-3 mb-3">
        {collections.length > 0 ? (
          collections.map((collection) => (
            <CheckBox
              key={collection.id}
              label={collection.name}
              name={`collection-${collection.id}`}
            />
          ))
        ) : (
          <p className="text-[1rem] text-detailColor">컬렉션이 없습니다.</p>
        )}
        <div
          className="flex gap-[0.5rem] items-center cursor-pointer"
          onClick={handleAddNewCollection}
        >
          <Image
            src={add}
            alt="새 컬렉션 추가하기"
            width={(8 * 12) / 16}
            height={(8 * 12) / 16}
          />
          <p className="text-[0.875rem] text-detailColor font-normal">
            새 컬렉션 추가하기
          </p>
        </div>
      </div>
      <Button text="수정하기" />
    </form>
  );
};

export default MyCollection;
