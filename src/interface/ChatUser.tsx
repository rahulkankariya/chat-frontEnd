export interface ChatUser {
    lastMessageTime: string;
    lastMessage:string
    id:string
    name: string;
    avatar: string;
    online: boolean;
    type?: 'personal' | 'groups';
    messageStatus:'pending' | 'sent' | 'delivered' | 'read';
  }
  