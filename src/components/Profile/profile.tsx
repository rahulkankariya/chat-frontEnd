import React, { useState, useEffect } from 'react';

// import QRCode from 'qrcode.react';
import { getUserFromStorage } from '../../utils/storage';
// import { SocketContext } from '../../socket/SocketContextType';
import socket from '../../socket/socket';
import SideNav from '../Pages/SideNavbar';



const Profile: React.FC = () => {
  // Initialize profile with default privacy values to avoid undefined

  const [isEditing, setIsEditing] = useState(false);
//   const { onlineUsers } = useContext(SocketContext) || {};
  const activeRoute = 'Profile';

  // Mock data for activity log, badges, and linked accounts


  // Handle real-time profile updates
  useEffect(() => {
  
  }, []);

  // Handle privacy toggle

  // Mock QR code URL
//   const qrCodeUrl = `https://chatapp.com/profile/${profile.email || 'user'}`;

  return (
    <div className="flex justify-between h-screen w-screen bg-[#F8F7FC]">
      {/* SideNav */}
      <div>
        <SideNav activeRoute={activeRoute} />
      </div>

      {/* Profile Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <p>dd</p>
      </div>
    </div>
  );
};

export default Profile;