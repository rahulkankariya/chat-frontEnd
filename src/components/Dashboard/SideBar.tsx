import React, { useState } from 'react';
import { User } from './User';
import { Menu, Close } from '@mui/icons-material'; // Importing MUI icons for the hamburger menu

interface SidebarProps {
  users: User[];
  selectedUser: string;
  onSelectUser: (user: User) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ users, selectedUser, onSelectUser }) => {
  const [isOpen, setIsOpen] = useState(false); // State to handle the mobile menu toggle

  return (
    <div className="w-full sm:w-64 bg-gray-800 text-white h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold">Rahul_Kankariya</h3>

        {/* Hamburger Icon for Mobile */}
        <button
          className="sm:hidden text-white"
          onClick={() => setIsOpen(!isOpen)} // Toggle the mobile menu
        >
          {isOpen ? (
            <Close className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu - Hidden by default on small screens */}
      <ul
        className={`sm:hidden ${isOpen ? 'block' : 'hidden'} overflow-y-auto p-2 space-y-1 flex-1`}
      >
        {users.map((user, index) => (
          <li
            key={`${user.name}-${index}`}
            onClick={() => onSelectUser(user)}
            className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-gray-700 ${
              selectedUser === user.name ? 'bg-gray-700' : ''
            }`}
          >
            <div className="relative">
              {/* User Avatar with fixed size */}
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span
                className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border-2 border-white ${
                  user.online ? 'bg-green-500' : 'bg-red-500'
                }`}
              ></span>
            </div>
            <div className="flex-1 overflow-hidden">
              <span className="text-xs truncate">{user.name}</span> {/* Show smaller name */}
            </div>
          </li>
        ))}
      </ul>

      {/* Desktop Menu (always visible) */}
      <ul className="sm:flex sm:flex-col sm:space-y-1 sm:p-2 sm:overflow-y-auto sm:block hidden overflow-x-hidden">
        {users.map((user, index) => (
          <li
            key={`${user.name}-${index}`}
            onClick={() => onSelectUser(user)}
            className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-gray-700 ${
              selectedUser === user.name ? 'bg-gray-700' : ''
            }`}
          >
            <div className="relative">
              {/* User Avatar with fixed size */}
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span
                className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border-2 border-white ${
                  user.online ? 'bg-green-500' : 'bg-red-500'
                }`}
              ></span>
            </div>
            <div className="flex-1 overflow-hidden">
              {/* Name with text truncation and wrapping */}
              <span className="block truncate text-xs sm:text-sm break-words w-40">{user.name}</span>
              {/* Fixed width for name */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
