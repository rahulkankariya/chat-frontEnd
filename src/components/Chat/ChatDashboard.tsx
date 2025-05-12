import React, { useState, useEffect, useContext } from 'react';
import { ChatUser } from '../../interface/ChatUser';
import Sidebar from './ChatSidebar';
import MessagePanel from './ChatMessagePanel';
import { SocketContext } from '../../socket/SocketContextType';
import socket from '../../socket/socket';
import { getUserFromStorage } from '../../utils/storage';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
const Dashboard: React.FC = () => {
  const [users, setUsers] = useState<ChatUser[]>([]); // State to hold the user list
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null); // State for selected user
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [totalPages, setTotalPages] = useState(1); // Track total pages
  const { onlineUsers } = useContext(SocketContext) || {}; // Context for online user states

  const itemsPerPage = 10; // Number of users per page
  const userProfile = getUserFromStorage();

  // Fetch user profile from local storage (e.g., logged-in user)
  // const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}') || {
  //   name: 'Guest',
  //   avatar: '',
  // };

  // Fetch chat user list from backend
  const fetchChatUserList = (pageIndex: number, pageSize: number) => {
    setIsLoading(true);
    setError(null);
    socket.emit('chat-user-list', pageIndex, pageSize); // Emit event to fetch user list
  };

  // Set up socket listener for chat-user-list
  useEffect(() => {
    const handleChatUserList = (response: any) => {
      setIsLoading(false);
      if (response.executed === 1) {
        console.log("Online Find==>",response?.data?.data?.userList)
        const fetchedUsers = response?.data?.data?.userList.map((user: any) => ({
          id: user.id,
          name: user.firstName + ' ' + user.lastName,
          avatar: user.avatar_url,
          online: user.onlines == 1 ? true:false,
          lastMessage :user.last_message,
          lastMessageTime:user.last_message_time,
        
        }));

        // Append users for pagination, avoid duplicates
        setUsers((prevUsers) => {
          const existingIds = new Set(prevUsers.map((u) => u.id));
          const newUsers = fetchedUsers.filter((u: { id: string; }) => !existingIds.has(u.id));
          return [...prevUsers, ...newUsers];
        });

        // Update total pages
        setTotalPages(response?.data?.data?.totalPages || 1);

        // Select first user if none is selected and users are available
        if (!selectedUser && fetchedUsers.length > 0) {
          setSelectedUser(fetchedUsers[0]);
        }
      } else {
        setError('Failed to fetch user list');
      }
    };

    socket.on('chat-user-list', handleChatUserList);

    // Clean up listener on unmount
    return () => {
      socket.off('chat-user-list', handleChatUserList);
    };
  }, [selectedUser, onlineUsers]); // Dependencies: selectedUser, onlineUsers

  // Fetch users when currentPage changes
  useEffect(() => {
    fetchChatUserList(currentPage, itemsPerPage);
  }, [currentPage]);

  // Handle scroll for infinite scrolling
  const handleScroll = (e: React.UIEvent<HTMLUListElement>) => {
    const el = e.currentTarget;
    const isBottom = Math.abs(el.scrollHeight - el.scrollTop - el.clientHeight) < 1;

    if (isBottom && currentPage < totalPages && !isLoading) {
      setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8F7FC] p-4">
      {/* Sidebar */}
      <div className="w-80 h-full bg-white shadow-md rounded-[10px]">
        <Sidebar
          userProfile={userProfile} // Pass user profile to Sidebar
          users={users}
          // onSelectUser={selectedUser?.id}
          onSelectUser={(user) => setSelectedUser(user)}
          onScroll={handleScroll}
          isLoading={isLoading}
          error={error}
        />
      </div>

      {/* Message Panel */}
      <div className="flex-1 bg-white shadow-md rounded-[10px] ml-4">
        {selectedUser ? (
          <MessagePanel
            userName={selectedUser.name}
            avatar={selectedUser.avatar}
            online={selectedUser.online}
            receiverId={selectedUser.id}  
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-gray-500 space-y-2">
       <ChatBubbleOutlineIcon style={{ fontSize: 40 }} />
          <div className="text-lg font-semibold">No Chat Selected</div>
          <div className="text-sm text-gray-400">Select a user from the sidebar to start chatting</div>
        </div>
        
        
        )}
      </div>
    </div>
  );
};

export default Dashboard;