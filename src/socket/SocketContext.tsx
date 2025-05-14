import React, { useContext, useEffect, useState, useRef } from "react";
import socket from "./socket";
import { AuthContext } from "../context/AuthContextType";
import { SocketContext } from "./SocketContextType";

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useContext(AuthContext)!;
  const [onlineUsers, setOnlineUsers] = useState<{ [key: string]: number }>({});
  const onlineUsersRef = useRef(onlineUsers);

  useEffect(() => {
    onlineUsersRef.current = onlineUsers;
  }, [onlineUsers]);

  useEffect(() => {
    if (!token) return;

    socket.io.opts.extraHeaders = { Authorization: `${token}` };
    socket.connect();

    socket.emit("user-online");

   socket.on("user-status-updated", ({ userId, status }) => {
      setOnlineUsers((prev) => ({
        ...prev,
        [userId]: status === "online" ? 1 : 0,
      }));
    });

    socket.on("chat-user-list", () => {
      socket.emit("current-users", onlineUsersRef.current);
    });

    return () => {
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
