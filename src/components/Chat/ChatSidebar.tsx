import React, { useState } from 'react';
import { ChatUser } from '../../interface/ChatUser';
import { Menu, Close, Edit } from '@mui/icons-material';
import UserProfile from './UserProfile';

interface SidebarProps {
  users: ChatUser[];
  selectedUser: number; // Change selectedUser to number for user id
  onSelectUser: (user: ChatUser) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ users, selectedUser, onSelectUser }) => {
  const [isOpen, setIsOpen] = useState(false);

  const renderUserList = () =>
    users.map((user) => (
      <UserProfile
        key={user.id} // Use unique id as the key
        avatar={user.avatar}
        name={user.name}
        online={user.online}
        onSelectUser={() => onSelectUser(user)}
        isSelected={selectedUser === user.id} // Compare by user.id (number)
        message="Hello! How are you?"
        lastMessageTime="10:45 AM"
        messageStatus={['pending', 'sent', 'delivered', 'read'][user.id % 4] as any}
      />
    ));

  return (
    <div className="flex flex-col h-full bg-white rounded-[10px] shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="text-lg font-semibold">Rahul_Kankariya</h3>
        <div className="flex items-center gap-2">
          <button onClick={() => alert('Edit Profile')}>
            <Edit className="w-5 h-5 text-gray-600" />
          </button>
          <button className="sm:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <Close className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* User List with Scroll */}
      <ul
        className={`flex-1 overflow-y-auto p-2 space-y-1 ${
          isOpen ? 'block sm:block' : 'hidden sm:block'
        }`}
        style={{ maxHeight: 'calc(100vh - 125px)' }} // adjust header height
      >
        {renderUserList()}
      </ul>
    </div>
  );
};

export default Sidebar;
