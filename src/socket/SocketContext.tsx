import React, { useContext, useEffect, useState } from "react";
import socket from "./socket";
import { AuthContext } from "../context/AuthContextType";
import { SocketContext } from "./SocketContextType";

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useContext(AuthContext)!;
  const [onlineUsers, setOnlineUsers] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    if (!token) return;

    socket.io.opts.extraHeaders = { Authorization: `${token}` };
    socket.connect();

    socket.emit("user-online");

    socket.on("user-status-updated", ({ userId, status }: { userId: string; status: number }) => {
      setOnlineUsers((prev) => ({
        ...prev,
        [userId]: status,
      }));
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

export default SocketProvider;
