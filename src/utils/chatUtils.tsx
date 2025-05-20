// src/utils/chatUtils.ts
import { Message } from '../components/Chat/ChatMessagePanel';

export const formatDate = (timestamp: number): string => {
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

export const parseMessages = (list: any[]): Message[] => {

  return list.map((msg) => ({
    text: msg.message || '',
    audioUrl: msg.mediaType === 'audio' ? msg.mediaUrl : undefined,
    fromMe: msg.fromMe === 1,
    timestamp: msg.createdAt ? new Date(msg.createdAt).getTime() : Date.now(),
    messageStatus:msg.messageStatus
  }));
};