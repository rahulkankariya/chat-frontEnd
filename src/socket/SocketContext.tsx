import React, { useContext, useEffect, useState, useRef } from "react";
import socket from "./socket";
import { AuthContext } from "../context/AuthContextType";
import { SocketContext } from "./SocketContextType";

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useContext(AuthContext)!;
  const [onlineUsers, setOnlineUsers] = useState<{ [key: string]: number }>({});
  const onlineUsersRef = useRef(onlineUsers);

  // Ensure the ref is updated whenever the onlineUsers state changes
  useEffect(() => {
    onlineUsersRef.current = onlineUsers;
  }, [onlineUsers]);

  useEffect(() => {
    if (!token) return;

    socket.io.opts.extraHeaders = { Authorization: `${token}` };
    socket.connect(); // Make sure to connect when token is available

    // Emit online status when the user connects
    socket.emit("user-online");

    // Listen for status updates from the server
    socket.on("user-status-updated", ({ userId, status }) => {
      setOnlineUsers((prev) => ({
        ...prev,
        [userId]: status === "online" ? 1 : 0,
      }));
    });

    // Handle the case when chat user list is requested
    socket.on("chat-user-list", () => {
      socket.emit("current-users", onlineUsersRef.current); // Send current online users list
    });

    // Handle reconnection
    socket.on("reconnect", () => {
      console.log("Reconnected to server");
      // Emit online status after reconnection
      socket.emit("user-online");
    });

    // check redis
    // socket.emit("ping-redis");
    // socket.on("pong-redis", (response) => {
    //   // console.log("Redis Pong Response:", response);
    //   if (response === "PONG") {
    //     // console.log("Redis is working!");
    //   } else {
    //     console.log("Error: Redis might not be working properly.");
    //   }
    // });


    return () => {
      // When the component unmounts or token changes, disconnect the user
      socket.emit("user-disconnected");
      socket.disconnect();
    };
  }, [token]); // Effect depends on token (auth context)

  return (
    <SocketContext.Provider value={{ onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
