import { io } from "socket.io-client";

// Ganti dengan IP backend kamu di jaringan lokal
const socket = io("http://192.168.9.192:3002"); // IP backend kamu, jangan pakai localhost kalau beda komputer

export default socket;
