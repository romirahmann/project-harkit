import { io } from "socket.io-client";
import { baseUrl } from "./api.service";

const socket = io(baseUrl);

export const listenToUpdate = (event, payload) => {
  socket.on(event, payload);

  return () => {
    socket.off(event, payload);
  };
};

export const emitJoinRoom = (roomId) => {
  socket.emit("join", { room: roomId });
};

export default socket;
