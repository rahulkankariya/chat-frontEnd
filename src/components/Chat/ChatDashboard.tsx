import React, { useState, useEffect, useContext } from 'react';
import { ChatUser } from '../../interface/ChatUser';
import Sidebar from './ChatSidebar';
import MessagePanel from './ChatMessagePanel';
import { SocketContext } from '../../socket/SocketContextType';  // Assuming you have a SocketContext to provide online users
import socket from '../../socket/socket';  // Your socket instance

const Dashboard: React.FC = () => {
  const [users, setUsers] = useState<ChatUser[]>([]); // State to hold the user list
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);  // State for selected user
  const { onlineUsers } = useContext(SocketContext) || {};  // Context for online user states (safe fallback)

  // Fetch chat user list from backend
  const fetchChatUserList = () => {
    socket.emit('chat-user-list', 1, 10);  // Emit the event to fetch user list (pageIndex = 1, pageSize = 10)

    socket.once('chat-user-list', (response: any) => {
      console.log("Response: ", response.data.data.userList);
      if (response.executed === 1) {
        const fetchedUsers = response?.data?.data?.userList.map((user: any) => ({
          id: user.id,
          name: user.firstName + " "+ user.lastName,
          avatar: user.avatar_url,
          online: onlineUsers?.[user.id] === 1,  // Check if the user is online from SocketContext
        }));
        setUsers(fetchedUsers);
        setSelectedUser(fetchedUsers[0]);  // Set the first user as the default selected user
      } else {
        console.error('Failed to fetch user list');
      }
    });
  };

  useEffect(() => {
    fetchChatUserList();  // Fetch the user list on component mount

    return () => {
      socket.off('chat-user-list');  // Cleanup socket listener on component unmount
    };
  }, []);  // Only run once when the component mounts (empty dependency array)

  // Avoid re-fetching unless onlineUsers or selectedUser actually changes
  useEffect(() => {
    if (selectedUser) {
      const updatedUsers = users.map(user => ({
        ...user,
        online: onlineUsers?.[user.id] === 1,
      }));
      setUsers(updatedUsers);
    }
  }, [onlineUsers, selectedUser]);

  if (!selectedUser) return null;  // If there's no selected user, don't render MessagePanel yet

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
          online={selectedUser.online}
        />
      </div>
    </div>
  );
};

export default Dashboard;
