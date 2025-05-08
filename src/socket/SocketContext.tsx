import React, { useContext, useEffect, useState, useRef } from "react";
import socket from "./socket";  // Assuming you have your socket instance here
import { AuthContext } from "../context/AuthContextType";  // Your auth context
import { SocketContext } from "./SocketContextType";  // Socket context for sharing state

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useContext(AuthContext)!;  // Assuming you have a token in your context
  const [onlineUsers, setOnlineUsers] = useState<{ [key: string]: number }>({});

  // Use useRef to store onlineUsers without triggering rerenders
  const onlineUsersRef = useRef(onlineUsers);

  useEffect(() => {
    // Update ref whenever onlineUsers state changes
    onlineUsersRef.current = onlineUsers;
  }, [onlineUsers]);

  useEffect(() => {
    if (!token) return;

    socket.io.opts.extraHeaders = { Authorization: `${token}` };
    socket.connect();

    // Emit user-online when the component mounts (meaning the user opened the app/tab)
    socket.emit("user-online");

    // Listen for online/offline updates from the server
    socket.on("user-status-updated", ({ userId, status }: { userId: string; status: string }) => {
      setOnlineUsers((prev) => ({
        ...prev,
        [userId]: status === "online" ? 1 : 0,
      }));
    });

    // Listen to the event when the server asks for the current online users
    socket.on("chat-user-list", () => {
      // Emit current users using the ref to avoid re-render on state change
      socket.emit("current-users", onlineUsersRef.current);
    });

    return () => {
      // Emit user-disconnected when the user disconnects (tab is closed)
      socket.emit("user-disconnected");
      socket.disconnect();
    };
  }, [token]);

  return (
    <SocketContext.Provider value={{ onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
