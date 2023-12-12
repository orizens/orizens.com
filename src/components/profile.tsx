import profile from './profile.jpg';

const ProfileAvatar = ({ className = '' }) => (
  <img
    className={`h-44 w-44 rounded-full border-4 border-primary ${className}`}
    alt="Profile Avatar"
    loading="lazy"
    {...profile}
  />
);

export { ProfileAvatar };
