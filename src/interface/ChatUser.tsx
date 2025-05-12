export interface ChatUser {
    lastMessageTime: string;
    lastMessage:string
    messageStatus: string;

        id:string
    name: string;
    avatar: string;
    online: boolean;
    type?: 'personal' | 'groups';
  }
  