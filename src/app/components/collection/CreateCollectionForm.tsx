import React from 'react';
import { redirect } from 'next/navigation';
import Input from './Input';
import CheckBox from './CheckBox';
import createNewPCollection from '../../../services/collection/createNewCollection';
import Button from './Button';

export default function CreateCollectionForm() {
  async function handleSubmit(formData: FormData) {
    'use server';
    const collection_name = formData.get('collection_name') as string;
    const description = formData.get('description') as string | null;
    const visibilityField = formData.get('visibility') as string;
    const visibility: 'public' | 'private' =
      visibilityField === 'on' ? 'public' : 'private';

    const newCollection = {
      collection_name,
      description,
      image_url: '',
      visibility,
    };

    await createNewPCollection(newCollection);
    redirect('/');
  }

  return (
    <form
      action={handleSubmit}
      className="w-[63.25rem] p-16 flex flex-col gap-12 bg-white rounded-[0.5rem]"
    >
      <h1 className="text-[1.5rem] font-semibold text-titleColor">
        새 컬렉션 추가
      </h1>
      <div className="flex flex-col gap-3">
        <Input
          name="collection_name"
          label="컬렉션 이름"
          placeholder="컬렉션 이름을 입력하세요"
        />
        <Input
          name="description"
          label="컬렉션 설명"
          placeholder="컬렉션 설명을 입력하세요"
        />
        <CheckBox name="visibility" label="공개로 설정" />
      </div>
      <Button text="추가하기" />
    </form>
  );
}
