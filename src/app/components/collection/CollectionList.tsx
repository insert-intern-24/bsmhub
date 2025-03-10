import React from 'react';
import CollectionItem from './CollectionItem';
import type { Collection } from '@models/collection';

interface CollectionListProps {
  collections : Collection[];
  onClick: (id: number) => void;
  selectedCollectionId : number | null;
}

function CollectionList({ collections, onClick, selectedCollectionId }: CollectionListProps) {

  return (
    <div className="w-full p-8">
      <div className="flex flex-wrap gap-4">
        {collections.map((collection) => (
          <CollectionItem
            key={collection.collection_id}
            collection_id={collection.collection_id}
            collection_name={collection.collection_name}
            created_at={collection.created_at}
            ended_at={collection.ended_at}
            image_url={collection.image_url}
            onClick={onClick}
            selected={selectedCollectionId === collection.collection_id}
          />
        ))}
      </div>
    </div>
  );
}

export default CollectionList;
