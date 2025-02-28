import React from 'react';
import { UserDataType } from '@/app/models/user';
import CollectionItem from '../../collection/CollectionItem';
import { formatDate } from '@/utils/date';

const UserCollections = ({ userData }: { userData: UserDataType }) => {

  return (
    <div className="flex justify-around w-full flex-wrap">
      {userData?.collections.map((collection) => (
        <CollectionItem 
          key={collection.collection_id}
          id={collection.collection_id}
          title={collection.collection_name}
          startDate={formatDate(collection.created_at)}
          endDate={'2025년 3월 2일'}
          thumbnail={collection.image_url}
          onClick={() => alert("1")}
          selected={false}
        />
      ))}
    </div>
  )
}

export default UserCollections