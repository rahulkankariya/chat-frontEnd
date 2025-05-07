import React, { useState } from 'react';
import { ChatUser } from '../../interface/ChatUser';
import Sidebar from './ChatSidebar';
import MessagePanel from './ChatMessagePanel';
interface SidebarProps {
  users: ChatUser[];
  selectedUser: string;
  onSelectUser: (user: ChatUser) => void;
}

const Dashboard: React.FC = () => {
  const users: ChatUser[] = [

    { id: 1, name: 'Rahul Kankariya', avatar: 'https://randomuser.me/api/portraits/men/12.jpg', online: true },
    
    { id: 2, name: 'Alice Johnson', avatar: 'https://randomuser.me/api/portraits/women/21.jpg', online: true },
    { id: 3, name: 'Bob Smith', avatar: 'https://randomuser.me/api/portraits/men/34.jpg', online: true },
    { id: 4, name: 'Chloe Davis', avatar: 'https://randomuser.me/api/portraits/women/42.jpg', online: true },
    { id: 5, name: 'Daniel Lee', avatar: 'https://randomuser.me/api/portraits/men/51.jpg', online: true },
    { id: 6, name: 'Eva Green', avatar: 'https://randomuser.me/api/portraits/women/33.jpg', online: true },
    { id: 7, name: 'Frank Miller', avatar: 'https://randomuser.me/api/portraits/men/61.jpg', online: true },
    { id: 8, name: 'Grace Hall', avatar: 'https://randomuser.me/api/portraits/women/53.jpg', online: true },
    { id: 9, name: 'Henry Clark', avatar: 'https://randomuser.me/api/portraits/men/72.jpg', online: true },
    { id: 10, name: 'Isla Scott', avatar: 'https://randomuser.me/api/portraits/women/65.jpg', online: true },
    { id: 11, name: 'Jack Turner', avatar: 'https://randomuser.me/api/portraits/men/75.jpg', online: true },
    { id: 12, name: 'Kylie Moore', avatar: 'https://randomuser.me/api/portraits/women/67.jpg', online: true },
    { id: 13, name: 'Liam Young', avatar: 'https://randomuser.me/api/portraits/men/80.jpg', online: true },
    { id: 14, name: 'Mia Baker', avatar: 'https://randomuser.me/api/portraits/women/73.jpg', online: true },
    { id: 15, name: 'Noah Adams', avatar: 'https://randomuser.me/api/portraits/men/90.jpg', online: true },
    { id: 16, name: 'Olivia King', avatar: 'https://randomuser.me/api/portraits/women/78.jpg', online: true },
    { id: 17, name: 'Paul Walker', avatar: 'https://randomuser.me/api/portraits/men/95.jpg', online: true },
    { id: 18, name: 'Quinn Bell', avatar: 'https://randomuser.me/api/portraits/women/81.jpg', online: true },
    { id: 19, name: 'Ryan Cooper', avatar: 'https://randomuser.me/api/portraits/men/99.jpg', online: true },
    { id: 20, name: 'Sophie Diaz', avatar: 'https://randomuser.me/api/portraits/women/90.jpg', online: true },
    { id: 21, name: 'Thomas Evans', avatar: 'https://randomuser.me/api/portraits/men/15.jpg', online: true },
    { id: 22, name: 'Uma Fox', avatar: 'https://randomuser.me/api/portraits/women/19.jpg', online: true },
    { id: 23, name: 'Victor Gray', avatar: 'https://randomuser.me/api/portraits/men/20.jpg', online: true },
    { id: 24, name: 'Willow Hughes', avatar: 'https://randomuser.me/api/portraits/women/23.jpg', online: true },
    { id: 25, name: 'Xavier Irving', avatar: 'https://randomuser.me/api/portraits/men/24.jpg', online: true },
    { id: 26, name: 'Yara Jenkins', avatar: 'https://randomuser.me/api/portraits/women/25.jpg', online: true },
    
    // ...repeat or trim if needed
  ];
  const [selectedUser, setSelectedUser] = useState<ChatUser>(users[0]);
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8F7FC] p-4">
      {/* Sidebar */}
      <div className="w-80 h-full bg-white shadow-md rounded-[10px]">
       
        <Sidebar
          users={users}
          selectedUser={selectedUser.id}
          onSelectUser={(user) => setSelectedUser(user)}
        />
      
      </div>

      {/* Message Panel */}
      <div className="flex-1 bg-white shadow-md rounded-[10px] ml-4">
        
        <MessagePanel
          userName={selectedUser.name}
          avatar={selectedUser.avatar}
        />
       
      </div>
    </div>
  );
};

export default Dashboard;
