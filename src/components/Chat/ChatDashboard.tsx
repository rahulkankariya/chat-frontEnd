import React, { useState, useEffect, useContext } from 'react';
import { ChatUser } from '../../interface/ChatUser';
import Sidebar from './ChatSidebar';
import MessagePanel from './ChatMessagePanel';
import { SocketContext } from '../../socket/SocketContextType';
import socket from '../../socket/socket';
import { getUserFromStorage } from '../../utils/storage';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SideNav from '../Navbar/SideNavbar';

const Dashboard: React.FC = () => {
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { onlineUsers } = useContext(SocketContext) || {};
  const activeRoute = 'Messages'; // Set active route for this component

  const itemsPerPage = 10;
  const userProfile = getUserFromStorage();

  const fetchChatUserList = (pageIndex: number, pageSize: number) => {
    setIsLoading(true);
    setError(null);
    socket.emit('chat-user-list', pageIndex, pageSize);
  };

  useEffect(() => {
    const handleChatUserList = (response: any) => {
      setIsLoading(false);
      if (response.executed === 1) {
       
        const fetchedUsers = response?.data?.data?.userList.map((user: any) => ({
          id: user.id,
          name: user.firstName + ' ' + user.lastName,
          avatar: user.avatar_url,
          online: user.onlines == 1 ? true : false,
          lastMessage: user.last_message,
          lastMessageTime: user.last_message_time,
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

  useEffect(() => {
    fetchChatUserList(currentPage, itemsPerPage);
  }, [currentPage]);

  const handleScroll = (e: React.UIEvent<HTMLUListElement>) => {
    const el = e.currentTarget;
    const isBottom = Math.abs(el.scrollHeight - el.scrollTop - el.clientHeight) < 1;

    if (isBottom && currentPage < totalPages && !isLoading) {
      setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
    }
  };

  return (
    <div className="flex justify-between">
      <div>
        <SideNav activeRoute={activeRoute} />
      </div>

      <div className="flex h-screen w-screen overflow-hidden bg-[#F8F7FC] p-4">
        {/* Sidebar */}
        <div className="w-80 h-full bg-white shadow-md rounded-[10px]">
          <Sidebar
            userProfile={userProfile}
            users={users}
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
    </div>
  );
};

export default Dashboard;