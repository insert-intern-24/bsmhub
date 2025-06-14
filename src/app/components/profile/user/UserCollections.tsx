import React from 'react';
import { UserDataType } from '@/app/models/user';
import CollectionItem from '../../collection/CollectionItem';

const UserCollections = ({ userData }: { userData: UserDataType }) => {

  return (
    <div className="flex flex-wrap gap-[0.87rem]">
      {userData?.collections.map((collection) => (
        <CollectionItem 
          key={collection.collection_id}
          collection_id={collection.collection_id}
          collection_name={collection.collection_name}
          created_at={collection.created_at}
          ended_at={collection.ended_at}
          image_url={collection.image_url}
          onClick={() => {
            window.location.href = `/collection/${collection.collection_id}`
          }}
          selected={false}
        />
      ))}
    </div>
  )
}

export default UserCollections