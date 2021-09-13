import React from "react";
import { createContext } from "react";
import { useSocket } from "../hooks/useSocket";

export const SocketContext = createContext();
const endpoint = "http://127.0.0.1:4001";

export const SocketProvider = ({ children }) => {
  const { socket } = useSocket(endpoint);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
