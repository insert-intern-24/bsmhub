import Image from 'next/image';
import { convertFromDatabaseImageURL } from '@/utils/supabase/imageHostConverter';

const ProfileIcon = ({ image }: { image: string }) => {
  const imageUrl = convertFromDatabaseImageURL(image);
  return (
    <Image
      width={(120 / 16) * 14}
      height={(120 / 16) * 14}
      alt="프로필 사진"
      src={imageUrl}
      className="rounded-sm absolute -top-20"
    />
  );
};

export default ProfileIcon;
