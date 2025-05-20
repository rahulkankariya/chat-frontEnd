import React, { useState, useMemo } from 'react';
import { ChatUser } from '../../interface/ChatUser';
import { Search } from '@mui/icons-material';
import UserProfile from './UserProfile';
import TabGroup from '../common/tabs/tabGroup';

interface SidebarProps {
  userProfile: { firstName?: string;lastName:string, avatar: string; online?: boolean }; // Logged-in user profile
  users: ChatUser[];
  selectedUser?: string | number; // Allow string or number for ID
  onSelectUser: (user: ChatUser) => void;
  onScroll?: (e: React.UIEvent<HTMLUListElement, UIEvent>) => void;
  isLoading?: boolean; // From Dashboard
  error?: string | null; // From Dashboard
}

const Sidebar: React.FC<SidebarProps> = ({
  userProfile,
  users,
  selectedUser,
  onSelectUser,
  onScroll,
  isLoading = false,
  error = null,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false); // Toggle search bar
  const [searchQuery, setSearchQuery] = useState(''); // Search input
  const [activeTab, setActiveTab] = useState<string>('All'); // Active tab

  const tabs = ['All', 'Personal', 'Groups'];
console.log("User==?",users)
  // Filter users based on search query and active tab
  const filteredUsers = useMemo(() => {
    let result = users;
    console.log("Reslt==")
    // Filter by search query (case-insensitive)
    if (searchQuery) {
      result = result.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // // Filter by tab (example logic, adjust based on your data)
    // if (activeTab === 'Personal') {
    //   result = result.filter((user) => user.type === 'personal'); // Assume user.type exists
    // } else if (activeTab === 'Groups') {
    //   result = result.filter((user) => user.type === 'group'); // Assume user.type exists
    // }

    return result;
  }, [users, searchQuery, activeTab]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  // console.log("System Width==?",window.innerWidth)
  return (
    <div
  className="flex flex-col h-full bg-white md:shadow-md rounded-[10px]  md:p-4"
  style={{
    // width: window.innerWidth < 768 ? "calc(100% - 4rem)" : undefined,
    padding: window.innerWidth < 768 ? "10px" : undefined,
  }}
>
  {/* Header: User Profile */}
      <div className="flex items-center justify-between p-2 md:p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="">
            <img
              src={userProfile.avatar || 'default-avatar.png'}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover"
            />
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                'bg-green-500' 
              }`}
            ></span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{userProfile.firstName + " "+ userProfile.lastName + " "  || 'Guest'}</span>
            <span className="text-sm text-gray-500">Info Account</span>
          </div>
        </div>
        <Search
          style={{ fontSize: 24 }}
          className="text-gray-600 cursor-pointer"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
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
      <div className="w-full px-2 py-5">
        <div className="flex gap-1 bg-[#F7F7F7] border border-[#F7F7F7] rounded-3xl">
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
        onScroll={onScroll}
      >
        {error && (
          <li className="text-center p-4 text-red-500">{error}</li>
        )}
        {isLoading && filteredUsers.length === 0 && (
          <li className="text-center p-4 text-gray-500">Loading...</li>
        )}
        {!isLoading && !error && filteredUsers.length === 0 && (
          <li className="text-center p-4 text-gray-500">No users found</li>
        )}
        {filteredUsers.map((user, index) => (
        
          <UserProfile
          key={index}
          avatar={user.avatar}
          name={user.name}
          online={user.online}
          onSelectUser={() => onSelectUser(user)}
          isSelected={selectedUser === user.id}
          lastMessage={user.lastMessage}
          lastMessageTime={user.lastMessageTime}
          messageStatus={user.messageStatus}
        />
        ))}
        {isLoading && filteredUsers.length > 0 && (
          <li className="text-center p-4 text-gray-500">Loading more...</li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;