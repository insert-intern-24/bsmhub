import Image from 'next/image';
import { convertFromDatabaseImageURL } from '@/utils/supabase/imageHostConverter';

const PROFILE_ICON_SIZE = 105; // (120 / 16) * 14

interface ProfileIconProps {
  image: string;
}

const ProfileIcon = ({ image }: ProfileIconProps) => {
  return (
    <div
      className="absolute -top-20 rounded-sm overflow-hidden"
      style={{ width: PROFILE_ICON_SIZE, height: PROFILE_ICON_SIZE }}
    >
      <Image
        src={convertFromDatabaseImageURL(image)}
        alt="프로필 사진"
        fill
        className="object-cover"
        sizes={`${PROFILE_ICON_SIZE}px`}
        priority
      />
    </div>
  );
};

export default ProfileIcon;
