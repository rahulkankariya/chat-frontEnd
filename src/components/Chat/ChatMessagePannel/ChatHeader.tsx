// src/components/ChatHeader.tsx
import React from 'react';
import { IconButton } from '@mui/material';
import { Call as CallIcon, Videocam as VideocamIcon } from '@mui/icons-material';

interface ChatHeaderProps {
  userName: string;
  avatar: string;
  online: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = React.memo(({ userName, avatar, online }) => (
<div className="flex justify-between items-center gap-3 p-4 shadow">
  <div className="flex items-center gap-3">
    <img src={avatar} alt={`${userName}'s avatar`} className="w-10 h-10 rounded-full" />
    <div>
    <h2 className="font-semibold text-base ">{userName}</h2>
      <p className="text-xs">{online ? 'Online' : 'Offline'}</p>
    </div>
  </div>

  {/* Video and Audio Call Icons */}
  <div className="flex gap-2">
    <IconButton aria-label="Start audio call">
      <CallIcon />
    </IconButton>
    <IconButton aria-label="Start video call">
      <VideocamIcon />
    </IconButton>
  </div>
</div>


));