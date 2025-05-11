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

  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [totalPages, setTotalPages] = useState(1); // Track total pages

  const itemsPerPage = 10; // Number of users per page

  // Fetch chat user list from backend with pagination
  const fetchChatUserList = (pageIndex: number, pageSize: number) => {
    
    socket.emit('chat-user-list', pageIndex, pageSize);  // Emit the event to fetch user list (pageIndex, pageSize)

    socket.once('chat-user-list', (response: any) => {
      // console.log("Response: ", response);
      if (response.executed === 1) {
        const fetchedUsers = response?.data?.data?.userList.map((user: any) => ({
          id: user.id,
          name: user.firstName + " " + user.lastName,
          avatar: user.avatar_url,
          online: onlineUsers?.[user.id] === 1,  // Check if the user is online from SocketContext
        }));

        // Update the user list and pagination state
        setUsers((prevUsers) => [...prevUsers, ...fetchedUsers]); 
  
        // Append new users to the existing list
        setTotalPages(response?.data?.data?.totalPages || 1); // Set total pages based on the response
        setSelectedUser((prevSelectedUser) => prevSelectedUser || fetchedUsers[0]); // Select the first user if none selected
      } else {
        console.error('Failed to fetch user list');
      }
    });
  };

  // Load the user list when the component mounts or when currentPage changes
  useEffect(() => {
    console.log("Fetching data for page", currentPage);
  
    fetchChatUserList(currentPage, itemsPerPage);

    return () => {
      // socket.off('chat-user-list');  // Cleanup socket listener on component unmount
    };
  }, [currentPage]);  // Only fetch new users when currentPage changes



  const handleScroll = (e: React.UIEvent<HTMLUListElement>) => {
    const el = e.currentTarget;
    const isBottom = el.scrollHeight - el.scrollTop === el.clientHeight;
    
    if (isBottom && currentPage < totalPages) {
      setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev));
    }
  };

  if (!selectedUser) return null;  // If there's no selected user, don't render MessagePanel yet

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8F7FC] p-4">
      rahul
      {/* Sidebar */}
    
      <div className="w-80 h-full bg-white shadow-md rounded-[10px]">
        
        <Sidebar
          users={users}
          selectedUser={selectedUser.id}
          onSelectUser={(user) => setSelectedUser(user)}
          onScroll={handleScroll} // Pass scroll handler to Sidebar
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
