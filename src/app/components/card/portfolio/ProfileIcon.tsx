import ProfileImage from './components/ProfileImage';

const ProfileIcon = ({ image }: { image: string }) => {
  return (
    <ProfileImage
      src={image}
      size={{ width: (120 / 16) * 14, height: (120 / 16) * 14 }}
      shape="rounded"
      className="absolute -top-20"
    />
  );
};

export default ProfileIcon;
