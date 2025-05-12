import React, { useState, useRef, useEffect } from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
  AccessTime as AccessTimeIcon,
  Done as DoneIcon,
  DoneAll as DoneAllIcon,
  Call as CallIcon,
  Videocam as VideocamIcon
} from '@mui/icons-material';
import socket from '../../socket/socket'; // assuming this is where the socket connection is initialized

import AudioRecorder from '../Pages/audioRecorder';
interface Message {
  text?: string;
  audioUrl?: string;
  fromMe: boolean;
  timestamp: number;
  status?: 'pending' | 'sent' | 'delivered' | 'read';
}

interface MessagePanelProps {
  userName: string;
  avatar: string;
  online: boolean;
  reciverId: string;
}

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  const isToday = date.toDateString() === now.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) return 'Today';
  if (isYesterday) return 'Yesterday';

  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
};

const MessagePanel: React.FC<MessagePanelProps> = ({ userName, avatar, online, reciverId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [_audioUrl, setAudioUrl] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Send text message
  const sendMessage = () => {
    if (!input.trim()) return;

    const messageData = {
      reciverId,
      chatType: 'individual',
      message: input.trim(),
      mediaType: 'text',
      mediaUrl: ''
    };

    socket.emit('send-message', messageData);

    setMessages((prev) => [
      ...prev,
      {
        text: input.trim(),
        fromMe: true,
        timestamp: Date.now(),
        status: 'pending'
      }
    ]);
    setInput('');
  };

  const handleVoiceMessage = (_blob: Blob, url: string) => {
    setMessages((prev) => [
      ...prev,
      {
        audioUrl: url,
        fromMe: true,
        timestamp: Date.now(),
      },
    ]);
    setAudioUrl(url);
    
    // Set audioUrl to display audio controls
  };
  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch message list
  useEffect(() => {
    socket.emit('individual-message-list', {
      reciverId,
      pageIndex: 1,
      pageSize: 50
    });
  }, [reciverId]);

  // Listen for incoming messages
  useEffect(() => {
    socket.on('individual-message-list', (res) => {
      if (res?.executed === 1) {
  
        const list: any[] = res?.data?.data?.messageList ?? [];
       
        const parsed = list.map((msg) => ({
          text: msg.message,
          fromMe: msg.fromMe == 1 ? true :false,
          timestamp: Date.now()
        }));

        setMessages(parsed);
      }
    });

    socket.on("new-message", (res) => {
      if (res?.executed === 1) {

    
        const list = Array.isArray(res.data) ? res.data : [res.data]; // Ensure array

    
        const parsed = list.map((msg: { message: any; fromMe: number; createdAt: string | number | Date; }) => ({
          text: msg.message || "",
          fromMe: msg.fromMe === 1,
          timestamp: msg.createdAt ? new Date(msg.createdAt).getTime() : Date.now()
        }));
    

    
        setMessages((prevMessages) => [...prevMessages, ...parsed]);
      } else {
        console.warn("new-message response not executed or malformed:", res);
      }
    });
    

    return () => {
      socket.off('individual-message-list');
      socket.off('new-message');
    };
  }, [reciverId]);

  // Group messages by date
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
      <div className="flex justify-between items-center gap-3 p-4 shadow">
        <div className="flex items-center gap-3">
          <img src={avatar} alt={userName} className="w-10 h-10 rounded-full" />
          <div>
            <h2 className="font-semibold">{userName}</h2>
            <p className="text-xs">{online ? 'Online' : 'Offline'}</p>
          </div>
        </div>

        {/* Call Actions */}
        <div className="flex gap-2">
          <IconButton className="hover:text-blue-500" aria-label="audio call">
            <CallIcon />
          </IconButton>
          <IconButton className="hover:text-blue-500" aria-label="video call">
            <VideocamIcon />
          </IconButton>
        </div>
      </div>

      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.entries(groupedMessages)
          // .sort((a, b) => a[1][0].timestamp - b[1][0].timestamp)
          .map(([date, msgs], idx) => (
            <div key={idx} className="flex flex-col space-y-2">
              <div className="text-center text-xs text-gray-600 py-2">{date}</div>
              {msgs.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col max-w-xs ${msg.fromMe ? 'ml-auto items-end' : 'items-start'}`}
                >
                  <div
                    className={`px-4 py-2 rounded-xl text-sm relative ${
                      msg.fromMe
                        ? 'bg-[#DCF8C6] text-black rounded-br-none'
                        : 'bg-[#EEEFFA] text-black rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                    {msg.audioUrl && <audio controls src={msg.audioUrl} className="mt-1" />}
                    <div className="flex justify-end items-center gap-1 mt-1 text-[10px] text-gray-500">
                      <span>
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
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

      {/* Input Section */}
      <div className="p-1 flex items-center gap-3 bg-[#F0F2F5]">
        <div className="flex gap-3 items-center">
          <IconButton>
            <AttachFileIcon className="text-gray-500" />
          </IconButton>
          <AudioRecorder onStop={handleVoiceMessage} />
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
