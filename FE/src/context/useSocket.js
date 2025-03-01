import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { ApiUrl } from "../context/Urlapi";

const useSocket = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(ApiUrl, {
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      console.log("🔌 Connected to WebSocket");
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Disconnected from WebSocket");
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return socket;
};

export default useSocket;
