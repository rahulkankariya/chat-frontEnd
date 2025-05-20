import React, { useState, useEffect, useContext } from 'react';
import { ChatUser } from '../../interface/ChatUser';
import Sidebar from './ChatSidebar';
import MessagePanel from './ChatMessagePanel';
import { SocketContext } from '../../socket/SocketContextType';
import socket from '../../socket/socket';
import { getUserFromStorage } from '../../utils/storage';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SideNav from '../Pages/SideNavbar';
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const Dashboard: React.FC = () => {
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { onlineUsers } = useContext(SocketContext) || {}; // Get online users from context
  const itemsPerPage = 10;
  const userProfile = getUserFromStorage();
  const activeRoute = 'Messages';

  // Fetch chat user list with pagination
  const fetchChatUserList = (pageIndex: number, pageSize: number) => {
    setIsLoading(true);
    setError(null);
    socket.emit('chat-user-list', pageIndex, pageSize); // Emit event to fetch users
  };

  // Handle chat user list response from socket
  useEffect(() => {
    const handleChatUserList = (response: any) => {
      // console.log("REsponse==>",response)
      setIsLoading(false);
      if (response.executed === 1) {
        const fetchedUsers = response?.data?.data?.userList.map((user: any) => ({
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          avatar: user.avatar_url,
          online: onlineUsers?.[user.id] === 1,
          lastMessage: user.last_message,
          lastMessageTime: user.last_message_time,
          messageStatus:user.messageStatus
        }));

        setUsers((prevUsers) => {
          const existingIds = new Set(prevUsers.map((u) => u.id));
          const newUsers = fetchedUsers.filter((u: { id: string }) => !existingIds.has(u.id));
          return [...prevUsers, ...newUsers];
        });

        setTotalPages(response?.data?.data?.totalPages || 1);

        if (!selectedUser && fetchedUsers.length > 0) {
          setSelectedUser(fetchedUsers[0]);
        }
      } else {
        setError('Failed to fetch user list');
      }
    };

    socket.on('chat-user-list', handleChatUserList);

    return () => {
      socket.off('chat-user-list', handleChatUserList);
    };
  }, [selectedUser, onlineUsers]);

  // Fetch users on page change
  useEffect(() => {
    fetchChatUserList(currentPage, itemsPerPage);
  }, [currentPage]);

  // Re-map online status on any update
  useEffect(() => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => ({
        ...user,
        online: onlineUsers?.[user.id] === 1,
      }))
    );
  }, [onlineUsers]);

  const handleScroll = (e: React.UIEvent<HTMLUListElement>) => {
    const el = e.currentTarget;
    const isBottom = Math.abs(el.scrollHeight - el.scrollTop - el.clientHeight) < 1;

    if (isBottom && currentPage < totalPages && !isLoading) {
      setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
    }
  };

  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="h-screen w-screen bg-[#F8F7FC] overflow-hidden flex flex-col">
    {/* Top Navigation Area for Toggle Button (Mobile Only) */}
    <div className="w-full flex items-center p-4 md:hidden bg-white shadow z-10">
      <button onClick={() => setShowSidebar((prev) => !prev)}>
        {showSidebar ? <CloseIcon /> : <MenuIcon />}
      </button>
      <span className="ml-4 font-semibold text-gray-700">Messages</span>
    </div>
  
    {/* Main Content Area */}
    <div className="flex flex-1 overflow-hidden">
      {/* Left SideNav (visible on md and above) */}
      <div className="hidden md:flex w-16 bg-white shadow-md">
        <SideNav activeRoute={activeRoute} />
      </div>
  
      {/* Sidebar (User List) */}
      <div
        className={`bg-white shadow-md rounded-[10px] transition-all duration-300 ease-in-out
          w-full sm:w-[40%] md:w-64 lg:w-80 h-full 
          ${showSidebar ? 'block' : 'hidden'} md:block
        `}
      >
        <Sidebar
          userProfile={userProfile}
          users={users}
          onSelectUser={(user) => {
            setSelectedUser(user);
            setShowSidebar(false);
          }}
          onScroll={handleScroll}
          isLoading={isLoading}
          error={error}
        />
      </div>
  
      {/* Message Panel */}
      <div className="flex-1 bg-white shadow-md rounded-[10px] overflow-hidden">
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
            <div className="text-sm text-gray-400">
              Select a user from the sidebar to start chatting
            </div>
          </div>
        )}
      </div>
    </div>
  
    {/* Bottom SideNav (Mobile Only) */}
    <div className="md:hidden w-full h-16 border-t bg-white shadow-md flex items-center justify-around">
      <SideNav activeRoute={activeRoute} />
    </div>
  </div>
  
  
  
  );
};

export default Dashboard;
