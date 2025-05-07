interface Message {
    text?: string;
    audioUrl?: string;
    fromMe: boolean;
    timestamp: number;
    status?: 'pending' | 'sent' | 'delivered' | 'read';
  }
  