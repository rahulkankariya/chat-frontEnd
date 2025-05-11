export interface ChatUser {
    messageStatus: string;
    lastMessage: string;
    id:number
    name: string;
    avatar: string;
    online: boolean;
    type?: 'personal' | 'groups';
  }
  