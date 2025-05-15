import { io } from "socket.io-client";
import { baseUrl } from "./Urlapi";

const socket = io(baseUrl);

export default socket;
