import React, { useState } from 'react';
import Sidebar from './SideBar';
import MessagePanel from './MessagePanel';
import { User } from './User';

const users: User[] = [

  { name: 'Rahul Kankariya Rahul Kankariya', avatar: 'https://randomuser.me/api/portraits/men/12.jpg', online: true },
  
  { name: 'Charlie', avatar: 'https://randomuser.me/api/portraits/men/12.jpg', online: true },
  
  // ...repeat or trim if needed
];

const Dashboard: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User>(users[0]);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar - fixed width */}
      <div className="w-80 h-full  border-r">
        <Sidebar
          users={users}
          selectedUser={selectedUser.name}
          onSelectUser={(user) => setSelectedUser(user)}
        />
      </div>

      {/* Message Panel - flexible */}
      <div className="flex-1 h-full">
        <MessagePanel
          userName={selectedUser.name}
          avatar={selectedUser.avatar}
        />
      </div>
    </div>
  );
};

export default Dashboard;
