import React, { useState } from 'react';
import { ChatUser } from '../../interface/ChatUser';
import { Search } from '@mui/icons-material';
import UserProfile from './UserProfile';
import TabGroup from '../common/tabs/tabGroup';

interface SidebarProps {
  users: ChatUser[];
  selectedUser: number;
  onSelectUser: (user: ChatUser) => void;
  onScroll?: (e: React.UIEvent<HTMLUListElement, UIEvent>) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ users, selectedUser, onSelectUser,onScroll }) => {
  console.log("SideNav==>",Sidebar)
  const [isSearchOpen, setIsSearchOpen] = useState(false); // State to toggle search bar visibility
  const [searchQuery, setSearchQuery] = useState(''); // State to store the search query
  const [activeTab, setActiveTab] = useState<string>('All'); // Tab state
 // Number of items per page (you can adjust this)
  console.log("SideNav==?", users, selectedUser)
  const tabs = ['All', 'Personal', 'Groups'];

  const handleTabChange = (tab: string) => {
    console.log('Tab selected:', tab);
    setActiveTab(tab);
  // Reset to the first page when tab changes
  };



  return (
    <div className="flex flex-col h-full bg-white shadow-md rounded-[10px] md:w-80 w-full">
      {/* Header */}ddd
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={users[1]?.avatar}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover"
            />
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${users[1]?.online ? 'bg-green-500' : 'bg-red-400'}`}
            ></span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{users[1]?.name || "N/A"}</span>
            <span className="text-sm text-gray-500">Info Account</span>
          </div>
        </div>
        <Search
          style={{ fontSize: 24 }}
          className="text-gray-600 cursor-pointer"
          onClick={() => setIsSearchOpen(!isSearchOpen)} // Toggle search bar visibility
        />
      </div>

      {/* Search Bar */}
      {isSearchOpen && (
        <div className="px-4 py-2">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full p-2 rounded-md border border-gray-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      {/* Tabs */}
      <div className="w-full px-2 p-5 rounded-md">
        <div className="flex gap-1 bg-[#F7F7F7] border border-[#F7F7F7]  rounded-3xl">
          <TabGroup
            tabs={tabs}
            selectedTab={activeTab}
            onTabChange={handleTabChange}
            activeBg="bg-white"
            inactiveBg="bg-gray-100"
            activeTextColor="text-[#3A60AE]"
            inactiveTextColor="text-gray-700"
          />
        </div>
      </div>

      {/* User List */}
      <ul
        className="flex-1 overflow-y-auto p-2 space-y-1 bg-white"
        style={{ maxHeight: 'calc(100vh - 240px)' }}
        onScroll={onScroll} // Attach scroll event handler
      >
        {users.length === 0 ? (
          <li className="text-center p-4">No users found</li>
        ) : (
          users.map((user,index) => (
            user.avatar!=""?
            <UserProfile
              key={index}
              avatar={user.avatar}
              name={user.name}
              online={user.online}
              onSelectUser={() => onSelectUser(user)}
              isSelected={selectedUser === user.id}
              message="Hello! How are you?"
              lastMessageTime="10:45 AM"
              messageStatus={['pending', 'sent', 'delivered', 'read'][user.id % 4] as any}
            />
            :""
          ))
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
