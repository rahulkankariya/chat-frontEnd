// src/context/SocketContextType.ts
import { createContext } from "react";

interface SocketContextType {
  onlineUsers: { [key: string]: number }; // Keyed by userId, and value is 0 (offline) or 1 (online)
}

export const SocketContext = createContext<SocketContextType | undefined>(undefined);