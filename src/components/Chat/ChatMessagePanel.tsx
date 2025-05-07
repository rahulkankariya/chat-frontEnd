import React, { useState, useRef, useEffect } from 'react';
import AttachFileIcon from '@mui/icons-material/AttachFile'; // Attach file icon
import MicIcon from '@mui/icons-material/Mic'; // Mic icon
import SendIcon from '@mui/icons-material/Send'; // Send icon
import { IconButton, InputAdornment, TextField } from '@mui/material'; // For material UI styling

interface Message {
  text: string;
  fromMe: boolean;
  timestamp: number; // Store as Unix timestamp in milliseconds (UTC)
}

interface MessagePanelProps {
  userName: string;
  avatar: string;
}

// Utility to format date as Today, Yesterday, or full date
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

const MessagePanel: React.FC<MessagePanelProps> = ({ userName, avatar }) => {
  const [messages, setMessages] = useState<Message[]>([
    { text: `Hey ${userName}, how's it going?`, fromMe: true, timestamp: Date.now() },
    { text: "I'm doing great, thanks!", fromMe: false, timestamp: Date.now() },
    { text: "How about you?", fromMe: false, timestamp: Date.now() },
    {
      text: "Old message",
      fromMe: false,
      timestamp: Date.now() - 86400000 * 2, // 2 days ago
    },
    {
      text: "Old message",
      fromMe: false,
      timestamp: Date.now() - 86400000 * 1, // 1 day ago
    },
  ]);

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = () => {
    if (input.trim()) {
      setMessages((prev) => [
        ...prev,
        {
          text: input.trim(),
          fromMe: true,
          timestamp: Date.now(),
        },
      ]);
      setInput('');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Group messages by formatted date
  const groupedMessages = messages.reduce((acc, msg) => {
    const dateKey = formatDate(msg.timestamp);
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(msg);
    return acc;
  }, {} as Record<string, Message[]>);

  return (
    <div className="flex flex-col h-full  rounded-[10px]">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 shadow">
        <img src={avatar} alt={userName} className="w-10 h-10 rounded-full" />
        <div>
          <h2 className="font-semibold">{userName}</h2>
          <p className="text-xs">Online</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col-reverse">
        <div ref={messagesEndRef} />
        {Object.entries(groupedMessages)
          .reverse()
          .map(([date, msgs], idx) => (
            <div key={idx} className="flex flex-col-reverse space-y-2 space-y-reverse">
              {msgs
                .slice()
                .reverse()
                .map((msg, i) => (
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
                          : 'bg-[#EEEFFA] text-black rounded-bl-none '
                      }`}
                    >
                      {msg.text}
                      <div className="text-[10px] text-gray-500 text-right mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              {/* Date separator */}
              <div className="text-center text-xs text-gray-600 py-2">{date}</div>
            </div>
          ))}
      </div>

      {/* Input Area */}
      <div className="p-4  flex items-center gap-3 border-t ">
        {/* Attachment and Mic Icons */}
        <div className="flex gap-3 items-center">
          <IconButton>
            <AttachFileIcon className="text-gray-500" />
          </IconButton>
          <IconButton>
            <MicIcon className="text-gray-500" />
          </IconButton>
        </div>
        
        {/* Input Box with Icons */}
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
