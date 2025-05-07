import React from 'react';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';

interface UserProfileProps {
  avatar: string;
  name: string;
  online: boolean;
  onSelectUser: () => void;
  isSelected: boolean;
  message: string;
  lastMessageTime: string;
  messageStatus: 'pending' | 'sent' | 'delivered' | 'read';
}

const UserProfile: React.FC<UserProfileProps> = ({
  avatar,
  name,
  online,
  onSelectUser,
  isSelected,
  message,
  lastMessageTime,
  messageStatus,
}) => {
  return (
    <li
      onClick={onSelectUser}
      className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors ${
        isSelected ? 'bg-[#E3E3E3]' : 'hover:bg-gray-100'
      }`}
    >
      {/* Avatar with online status */}
      <div className="relative">
        <img
          src={avatar}
          alt={name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
            online ? 'bg-green-500' : 'bg-red-400'
          }`}
        ></span>
      </div>

      {/* User name, message, and status */}
      <div className="flex-1 overflow-hidden">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium truncate">{name}</span>
          <span className="text-[10px] text-gray-400">{lastMessageTime}</span>
        </div>
        <div className="flex justify-between items-center gap-1 text-xs text-gray-500 truncate">
          {/* Message status icon */}
          <span className="truncate">{message}</span>
          {messageStatus === 'pending' && (
            <HourglassBottomIcon fontSize="inherit" />
          )}
          {messageStatus === 'sent' && <DoneIcon fontSize="inherit" />}
          {messageStatus === 'delivered' && <DoneAllIcon fontSize="inherit" />}
          {messageStatus === 'read' && (
            <DoneAllIcon fontSize="inherit" className="text-blue-500" />
          )}
        </div>
      </div>
    </li>
  );
};

export default UserProfile;
