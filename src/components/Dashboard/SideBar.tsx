import React, { useState } from 'react';
import { User } from './User';
import { Menu, Close ,Edit } from '@mui/icons-material'; 
import UserProfile from './UserProfile'; 
interface SidebarProps {
  users: User[];
  selectedUser: string;
  onSelectUser: (user: User) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ users, selectedUser, onSelectUser }) => {
  const [isOpen, setIsOpen] = useState(false); 

  return (
    <div className="w-full sm:w-80 bg-gray-800 text-white h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold">Rahul_Kankariya</h3>
        <button className="text-white" onClick={() => alert('Edit Profile')}>
          <Edit className="w-5 h-5" />
        </button>
        <button
          className="sm:hidden text-white"
          onClick={() => setIsOpen(!isOpen)} 
        >
          {isOpen ? (
            <Close className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
      <div className="text-sm font-bold">Message</div> 
      
    
      <label className=" text-[#737373] py-1 px-4 rounded-md text-sm font-bold">
        Request
      </label>
    </div>
    
      <ul
        className={`sm:hidden ${isOpen ? 'block' : 'hidden'} overflow-y-auto p-2 space-y-1 flex-1`}
      >
        {users.map((user, index) => (
          <UserProfile
            key={`${user.name}-${index}`}
            avatar={user.avatar}
            name={user.name}
            online={user.online}
            onSelectUser={() => onSelectUser(user)}
            isSelected={selectedUser === user.name}
            message="Hello! How are you?" 
          />
        ))}
      </ul>

  
      <ul className="sm:flex-col sm:space-y-1 sm:p-2 sm:overflow-y-auto sm:block hidden overflow-x-hidden">
        {users.map((user, index) => (
          <UserProfile
            key={`${user.name}-${index}`}
            avatar={user.avatar}
            name={user.name}
            online={user.online}
            onSelectUser={() => onSelectUser(user)}
            isSelected={selectedUser === user.name}
            message="Hello! How are you?" // Sample message, can be replaced with dynamic data
          />
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
