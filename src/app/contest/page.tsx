'use client';
import React, { useState } from 'react';
import CollectionList from '@/app/components/contest/CollectionList';
import ContestPanel from '@/app/components/contest/CollectionPanel';
import dummy from '@/app/contest/dummy.json';
import { Collection, Project } from '@models/collection';
import type { Collections } from '@models/collection';
const dummy: Collections = dummyData;

function CollectionPage() {
  const [selectedCollectionId, setSelectedCollectionId] = useState<number | null>(null);
  const searchCollection = ((id : number) : Collection | Project | undefined  => {
    return dummy.find(collection => collection.id === id);
  })

  return (
    <div className="flex">
      {selectedCollectionId != null && <ContestPanel collection={searchCollection(selectedCollectionId)}/>}
      <CollectionList
        collections={dummy}
        onClick={setSelectedCollectionId}
      />
    </div>
  );
}

export default CollectionPage;
