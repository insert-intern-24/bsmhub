import React from 'react';
import CollectionItem from './CollectionItem';
import type { Collections } from '@models/collection';

interface CollectionListProps {
  collections : Collections;
  onClick: (id: number) => number;
}

function CollectionList({ collections, onClick }: CollectionListProps) {
  return (
    <div className="w-full p-8">
      <div className="flex flex-wrap gap-4">
        {collections.map((collection, key) => (
          collection.type == "collection" && <CollectionItem
            key={key}
            id={collection.id}
            title={collection.title}
            startDate={collection.startDate}
            endDate={collection.endDate}
            onClick={onClick}
          />
        ))}
      </div>
    </div>
  );
}

export default CollectionList;
