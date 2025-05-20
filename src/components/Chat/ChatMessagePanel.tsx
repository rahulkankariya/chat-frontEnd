// src/components/MessagePanel.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import { ChatHeader } from './Chat-Message-Panel/ChatHeader';
import { MessageBubble } from './Chat-Message-Panel/MessageBubble';
import { MessageInput } from './Chat-Message-Panel/MessageInput';
import { formatDate, parseMessages } from '../../utils/chatUtils';
import {
  fetchMessageList,
  sendMessage,
  onMessageList,
  onNewMessage,
  MessageListResponse,
  NewMessageResponse,
} from '../../socket/socketService';

// Interfaces for type safety
export interface Message {
  text?: string;
  audioUrl?: string;
  fromMe: boolean;
  timestamp: number;
  messageStatus?: 'pending' | 'sent' | 'delivered' | 'read';
}

interface MessagePanelProps {
  userName: string;
  avatar: string;
  online: boolean;
  receiverId: string;
  messageStatus?: 'pending' | 'sent' | 'delivered' | 'read';
}

const MessagePanel: React.FC<MessagePanelProps> = ({ userName, avatar, online, receiverId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const topMessageRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Debounced input handler
  const debouncedSetInput = useCallback(debounce((value: string) => setInput(value), 1), []);

  // Send text message
  const handleSendMessage = useCallback(() => {
    if (!input.trim()) return;

    const messageData = {
      receiverId,
      chatType: 'individual',
      message: input.trim(),
      mediaType: 'text',
      mediaUrl: '',
    };

    sendMessage(messageData);

    setInput('');
  }, [input, receiverId]);

  // Handle voice message
  const handleVoiceMessage = useCallback((_blob: Blob, url: string) => {
    const messageData = {
      receiverId,
      chatType: 'individual',
      message: '',
      mediaType: 'audio',
      mediaUrl: url,
    };

    sendMessage(messageData);

    setMessages((prev) => [
      ...prev,
      {
        audioUrl: url,
        fromMe: true,
        timestamp: Date.now(),
        status: 'pending',
        
      },
    ]);
  }, [receiverId]);

  // Fetch messages with pagination
  const loadMessages = useCallback(async () => {
    try {
      const res = await fetchMessageList(receiverId, pageIndex, 50);
      console.log("REs==?",res)
      const list = res.data?.data?.messageList ?? [];
      const parsed = parseMessages(list);
      console.log("PArse==>",parsed)
      setMessages((prev) => (pageIndex === 1 ? parsed : [...parsed, ...prev]));
      setHasMore(list.length === 50);
    } catch (error) {
      console.error('Error fetching messages:', error);
      // TODO: Show toast notification for error
    }
  }, [receiverId, pageIndex]);

  // Initial message fetch and socket listeners
  useEffect(() => {
    loadMessages();

    const handleMessageList = (res: MessageListResponse) => {
    
      if (res.executed === 1) {
        const list = res.data?.data?.messageList ?? [];
        const parsed = parseMessages(list);
        setMessages((prev) => (pageIndex === 1 ? parsed : [...parsed, ...prev]));
        setHasMore(list.length === 50);
      }
    };

    const handleNewMessage = (res: NewMessageResponse) => {
      if (res.executed === 1) {
        const list = Array.isArray(res.data) ? res.data : [res.data];
        const parsed = parseMessages(list);
        setMessages((prev) => [...prev, ...parsed]);
      } else {
        console.error('New message response malformed:', res);
      }
    };

    const unsubscribeMessageList = onMessageList(handleMessageList);
    const unsubscribeNewMessage = onNewMessage(handleNewMessage);

    return () => {
      unsubscribeMessageList();
      unsubscribeNewMessage();
    };
  }, [receiverId, pageIndex, loadMessages]);

  // Infinite scrolling for pagination
  useEffect(() => {
    if (!topMessageRef.current || !hasMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPageIndex((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(topMessageRef.current);

    return () => {
      if (observerRef.current && topMessageRef.current) {
        observerRef.current.unobserve(topMessageRef.current);
      }
    };
  }, [hasMore]);

  // Group messages by date
  const groupedMessages = messages.reduce((acc, msg) => {
    const dateKey = formatDate(msg.timestamp);
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(msg);
    return acc;
  }, {} as Record<string, Message[]>);
  
  return (
    <div className="flex flex-col h-full rounded-[10px]" role="region" aria-label="Chat panel">
      <ChatHeader userName={userName} avatar={avatar} online={online} />
      <div className="flex-1 overflow-y-auto p-4 space-y-4" role="log" aria-live="polite">
        {hasMore && <div ref={topMessageRef} />}
        {Object.entries(groupedMessages).map(([date, msgs], idx) => (
          <div key={idx} className="flex flex-col space-y-2">
            <div className="text-center text-xs text-gray-600 py-2">{date}</div>
            {msgs.map((msg, i) => (
              <MessageBubble key={`${date}-${i}`} message={msg} />
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <MessageInput
        input={input}
        setInput={debouncedSetInput}
        sendMessage={handleSendMessage}
        handleVoiceMessage={handleVoiceMessage}
      />
    </div>
  );
};

export default MessagePanel;