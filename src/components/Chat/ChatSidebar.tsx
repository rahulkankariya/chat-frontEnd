import React, { useState } from 'react';
import { ChatUser } from '../../interface/ChatUser';
import { Search } from '@mui/icons-material';
import UserProfile from './UserProfile';
import TabGroup from '../common/tabs/tabGroup';

interface SidebarProps {
  users: ChatUser[];
  selectedUser: number;
  onSelectUser: (user: ChatUser) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ users, selectedUser, onSelectUser }) => {

  const [isSearchOpen, setIsSearchOpen] = useState(false); // State to toggle search bar visibility
  const [searchQuery, setSearchQuery] = useState(''); // State to store the search query
  const tabs = ['All', 'Personal', 'Groups', ];
  const [activeTab, setActiveTab] = useState<string>('All');

  const handleTabChange = (tab: string) => {
    console.log('Tab selected:', tab);
    setActiveTab(tab);
  };

  const filteredUsers = users.filter((user) => {
    if (activeTab === 'All') return true;
    return user.type === activeTab;
  }).filter((user) => {
    // Filter users based on the search query
    return user.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex flex-col h-full bg-white shadow-md rounded-[10px] md:w-80 w-full"> {/* Added responsive width */}
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={users[16]?.avatar}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover"
            />
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${users[16]?.online ? 'bg-green-500' : 'bg-red-400'}`}
            ></span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{users[16].name}</span>
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
          {/* {tabs.map((tab) => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-center capitalize text-sm font-bold py-[3px] rounded-3xl cursor-pointer transition
                ${activeTab === tab ? 'bg-white text-[#3A60AE]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 font-bold'}`}
            >
              {tab}
            </div>
          ))} */}
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
        style={{ maxHeight: 'calc(100vh - 240px)' }} // Adjusted height for better fit
      >
        {filteredUsers.map((user) => (
          <UserProfile
            key={user.id}
            avatar={user.avatar}
            name={user.name}
            online={user.online}
            onSelectUser={() => onSelectUser(user)}
            isSelected={selectedUser === user.id}
            message="Hello! How are you?"
            lastMessageTime="10:45 AM"
            messageStatus={['pending', 'sent', 'delivered', 'read'][user.id % 4] as any}
          />
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
