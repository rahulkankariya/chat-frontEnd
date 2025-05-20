// src/components/MessageBubble.tsx
import React from 'react';
import { AccessTime as AccessTimeIcon, Done as DoneIcon, DoneAll as DoneAllIcon } from '@mui/icons-material';
import { Message } from '../ChatMessagePanel';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = React.memo(({ message }) => {
  console.log("Message==?",message)
  const renderStatusIcon = (status?: Message['messageStatus']) => {
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
    <div
      className={`flex flex-col max-w-xs ${message.fromMe ? 'ml-auto items-end' : 'items-start'}`}
      role="article"
      aria-label={message.fromMe ? 'Sent message' : 'Received message'}
    >
      <div
        className={`px-4 py-2 rounded-xl text-sm relative ${
          message.fromMe
            ? 'bg-[#DCF8C6] text-black rounded-br-none'
            : 'bg-[#EEEFFA] text-black rounded-bl-none'
        }`}
      >
        {message.text}
        {message.audioUrl && (
          <audio controls src={message.audioUrl} className="mt-1" aria-label="Audio message" />
        )}
        <div className="flex justify-end items-center gap-1 mt-1 text-[10px] text-gray-500">
          <span>
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          {message.fromMe && renderStatusIcon(message.messageStatus)}
        </div>
      </div>
    </div>
  );
});