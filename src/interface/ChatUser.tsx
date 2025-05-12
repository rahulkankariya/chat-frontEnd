export interface ChatUser {
    messageStatus: string;
    lastMessage: string;
    id:string
    name: string;
    avatar: string;
    online: boolean;
    type?: 'personal' | 'groups';
  }
  