import AvatarImage from './AvatarImage';
import { convertFromDatabaseImageURL } from '@/services/supabase/imageHostConverter';

const AvatarIcon = ({ image }: { image: string | null }) => {
  if (!image) return null;
  const imageUrl = convertFromDatabaseImageURL(image);
  return (
    <AvatarImage
      src={imageUrl}
      size={{ width: (120 / 16) * 14, height: (120 / 16) * 14 }}
      shape="rounded"
      className="absolute -top-20"
    />
  );
};

export default AvatarIcon;

