'use client';
import React, { useState } from 'react';
import CollectionList from '@/app/components/contest/CollectionList';
import ContestPanel from '@/app/components/contest/CollectionPanel';
import dummyData from '@/app/collection/dummy.json';
import { Project,Collections,Collection } from '@models/collection';
const dummy = dummyData as Collections;

function CollectionPage() {
  const [selectedCollectionId, setSelectedCollectionId] = useState<number | null>(null);
  const searchCollection = ((id : number) : Collection | Project | undefined  => {
    return dummy.find(collection => collection.id === id && collection.type === "collection");
  })

  return (
    <div className="flex">
      {selectedCollectionId != null && <ContestPanel collection={searchCollection(selectedCollectionId) as Collection}/>}
      <CollectionList
        collections={dummy}
        onClick={(id: number) => setSelectedCollectionId(id)}
        selectedCollectionId={selectedCollectionId}
      />
    </div>
  );
}

export default CollectionPage;
