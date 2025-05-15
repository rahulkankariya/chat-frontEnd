// src/services/socketService.ts
import socket from './socket';

export interface MessageData {
  message: string;
  fromMe: number;
  createdAt: string | number | Date;
  mediaType?: string;
  mediaUrl?: string;
}

export interface MessageListResponse {
  executed: number;
  data?: {
    data?: {
      messageList: MessageData[];
    };
  };
}

export interface NewMessageResponse {
  executed: number;
  data: MessageData | MessageData[];
}

export const fetchMessageList = (
  receiverId: string,
  pageIndex: number,
  pageSize: number
): Promise<MessageListResponse> => {
  return new Promise((resolve, reject) => {
    socket.emit('individual-message-list', { receiverId, pageIndex, pageSize }, (res: MessageListResponse) => {
      if (res.executed === 1) resolve(res);
      else reject(new Error('Failed to fetch message list'));
    });
  });
};

export const sendMessage = (data: {
  receiverId: string;
  chatType: string;
  message: string;
  mediaType: string;
  mediaUrl: string;
}) => {
  socket.emit('send-message', data);
};

export const onMessageList = (callback: (res: MessageListResponse) => void) => {
  socket.on('individual-message-list', callback);
  return () => socket.off('individual-message-list', callback);
};

export const onNewMessage = (callback: (res: NewMessageResponse) => void) => {
  
  socket.on('new-message', callback);
  return () => socket.off('new-message', callback);
};