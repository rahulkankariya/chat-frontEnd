export interface ChatUser {
    id:number
    name: string;
    avatar: string;
    online: boolean;
    type: 'personal' | 'groups';
  }
  