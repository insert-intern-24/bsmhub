'use client';
import React, { useEffect, useState } from 'react';
import CollectionList from '@/app/components/collection/CollectionList';
import ContestPanel from '@/app/components/collection/CollectionPanel';
import { Collection } from '@models/collection';
import getCollections from '@/services/collection/getCollections';

function CollectionPage() {
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    const fetchCollections = async () => {
      const data = await getCollections();

      setCollections(data);
    }

    fetchCollections();
  }, [])

  const [selectedCollectionId, setSelectedCollectionId] = useState<number | null>(null);
  const searchCollection = ((id : number) : Collection | undefined  => {
    return collections.find(collection => collection.collection_id === id);
  })

  return (
    <div className="flex">
      {selectedCollectionId != null && <ContestPanel collection={searchCollection(selectedCollectionId) as Collection}/>}
      <CollectionList
        collections={collections}
        onClick={(id: number) => setSelectedCollectionId(id)}
        selectedCollectionId={selectedCollectionId}
      />
    </div>
  );
}

export default CollectionPage;
