import React, { useState, useRef, useEffect } from 'react';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MicIcon from '@mui/icons-material/Mic';
import SendIcon from '@mui/icons-material/Send';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import CallIcon from '@mui/icons-material/Call';
import VideoCallIcon from '@mui/icons-material/VideoCall';
interface Message {
  text: string;
  fromMe: boolean;
  timestamp: number;
  status?: 'pending' | 'sent' | 'delivered' | 'read';
}

interface MessagePanelProps {
  userName: string;
  avatar: string;
  online:boolean
}

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isToday) return 'Today';
  if (isYesterday) return 'Yesterday';

  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const MessagePanel: React.FC<MessagePanelProps> = ({ userName, avatar,online }) => {
  const [messages, setMessages] = useState<Message[]>([
    { text: `Hey ${userName}, how's it going?`, fromMe: true, timestamp: Date.now(), status: 'sent' },
    { text: "I'm doing great, thanks!", fromMe: false, timestamp: Date.now() },
    { text: "How about you?", fromMe: false, timestamp: Date.now() },
    {
      text: "Old message",
      fromMe: false,
      timestamp: Date.now() - 86400000 * 2,
    },
    {
      text: "Older message",
      fromMe: false,
      timestamp: Date.now() - 86400000 * 3,
    },
  ]);

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = () => {
    if (input.trim()) {
      const statuses: Message['status'][] = ['pending', 'sent', 'delivered', 'read'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

      setMessages((prev) => [
        ...prev,
        {
          text: input.trim(),
          fromMe: true,
          timestamp: Date.now(),
          status: randomStatus,
        },
      ]);
      setInput('');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const groupedMessages = messages.reduce((acc, msg) => {
    const dateKey = formatDate(msg.timestamp);
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(msg);
    return acc;
  }, {} as Record<string, Message[]>);

  const renderStatusIcon = (status?: Message['status']) => {
    switch (status) {
      case 'pending':
        return <AccessTimeIcon fontSize="inherit" className="text-gray-400" />;
      case 'sent':
        return <DoneIcon fontSize="inherit" className="text-gray-500" />;
      case 'delivered':
        return <DoneAllIcon fontSize="inherit" className="text-gray-500" />;
      case 'read':
        return <DoneAllIcon fontSize="inherit" className="text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full rounded-[10px]">
      {/* Header */}
     {/* Header */}
<div className="flex justify-between items-center gap-3 p-4 shadow">
  <div className="flex items-center gap-3">
    <img src={avatar} alt={userName} className="w-10 h-10 rounded-full" />
    <div>
      <h2 className="font-semibold">{userName}</h2>
      <p className="text-xs">{online ? 'Online' : 'Offline'}</p>
    </div>
  </div>

  {/* Audio/Video Call Buttons */}
  <div className="flex gap-2">
    <IconButton className="hover:text-blue-500" aria-label="audio call">
      <CallIcon />
    </IconButton>
    <IconButton className="hover:text-blue-500" aria-label="video call">
      <VideoCallIcon />
    </IconButton>
  </div>
</div>


      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.entries(groupedMessages)
          .sort((a, b) => {
            const dateA = new Date(a[1][0].timestamp).getTime();
            const dateB = new Date(b[1][0].timestamp).getTime();
            return dateA - dateB;
          })
          .map(([date, msgs], idx) => (
            <div key={idx} className="flex flex-col space-y-2">
              <div className="text-center text-xs text-gray-600 py-2">{date}</div>
              {msgs.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col max-w-xs ${
                    msg.fromMe ? 'ml-auto items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-xl text-sm relative ${
                      msg.fromMe
                        ? 'bg-[#DCF8C6] text-black rounded-br-none'
                        : 'bg-[#EEEFFA] text-black rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                    <div className="flex justify-end items-center gap-1 mt-1 text-[10px] text-gray-500">
                      <span>
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {msg.fromMe && renderStatusIcon(msg.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex items-center gap-3  bg-[#F0F2F5]">
        <div className="flex gap-3 items-center">
          <IconButton>
            <AttachFileIcon className="text-gray-500" />
          </IconButton>
          <IconButton>
            <MicIcon className="text-gray-500" />
          </IconButton>
        </div>

        <TextField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          variant="outlined"
          fullWidth
          placeholder="Type a message"
          className="bg-white"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={sendMessage}>
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </div>
    </div>
  );
};

export default MessagePanel;
