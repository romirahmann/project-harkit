import { io } from "socket.io-client";

const socket = io("http://192.168.9.208:3002");

export default socket;
