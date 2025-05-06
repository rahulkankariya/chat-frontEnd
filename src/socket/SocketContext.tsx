// src/context/SocketContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import socket from "./socket";  // Socket import
import { AuthContext } from "../App";

interface SocketContextType {
  onlineUsers: { [key: string]: number }; // Keyed by userId, and value is 0 (offline) or 1 (online)
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useContext(AuthContext)!;
  const [onlineUsers, setOnlineUsers] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    if (!token) return;

    // Set the Authorization token in the socket connection headers
    socket.io.opts.extraHeaders = { Authorization: `${token}` };
    socket.connect();

    // Emit the user-online event when the socket is connected
    socket.emit("user-online");

    // Listen for user status updates from the server (online/offline)
    socket.on("user-status-updated", ({ userId, status }: { userId: string; status: number }) => {
      setOnlineUsers((prev) => ({
        ...prev,
        [userId]: status, // Update the user status (1 = online, 0 = offline)
      }));
    });

    return () => {
      socket.emit("user-disconnected"); // Optionally, you can emit user-disconnected if you handle that event
      socket.disconnect();
    };
  }, [token]);

  return (
    <SocketContext.Provider value={{ onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
