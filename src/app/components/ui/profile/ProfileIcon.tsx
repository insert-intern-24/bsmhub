import ProfileImage from './ProfileImage';
import { convertFromDatabaseImageURL } from '@/services/supabase/imageHostConverter';

const ProfileIcon = ({ image }: { image: string }) => {
  const imageUrl = convertFromDatabaseImageURL(image);
  return (
    <ProfileImage
      src={imageUrl}
      size={{ width: (120 / 16) * 14, height: (120 / 16) * 14 }}
      shape="rounded"
      className="absolute -top-20"
    />
  );
};

export default ProfileIcon;
