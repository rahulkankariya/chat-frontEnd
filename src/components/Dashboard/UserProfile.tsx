import React from 'react';

interface UserProfileProps {
  avatar: string;
  name: string;
  online: boolean;
  onSelectUser: () => void;
  isSelected: boolean;
  message: string; // New prop for message
}

const UserProfile: React.FC<UserProfileProps> = ({
  avatar,
  name,
  online,
  onSelectUser,
  isSelected,
  message
}) => {
  return (
    <li
      onClick={onSelectUser}
      className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-gray-700 ${
        isSelected ? 'bg-gray-700' : ''
      }`}
    >
      <div className="relative">
        {/* User Avatar with fixed size */}
        <img
          src={avatar}
          alt={name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <span
          className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border-2 border-white ${
            online ? 'bg-green-500' : 'bg-red-500'
          }`}
        ></span>
      </div>
      <div className="flex-1 overflow-hidden">
        <span className="block truncate text-xs sm:text-sm break-words">{name}</span>
        {/* Display message below the name */}
        <span className="block text-xs text-gray-400 truncate">{message}</span>
      </div>
    </li>
  );
};

export default UserProfile;
