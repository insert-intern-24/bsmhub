import Image from 'next/image';
import { convertFromDatabaseImageURL } from '@/utils/supabase/imageHostConverter';

const ProfileIcon = ({ image }: { image: string }) => {
  const size = (120 / 16) * 14; // maintain existing px calculation
  const imageUrl = convertFromDatabaseImageURL(image);

  return (
    <div
      className="absolute -top-20 rounded-sm overflow-hidden"
      style={{ width: size, height: size }}
    >
      <Image
        src={imageUrl}
        alt="프로필 사진"
        fill
        className="object-cover"
        sizes={`${size}px`}
        priority
      />
    </div>
  );
};

export default ProfileIcon;
