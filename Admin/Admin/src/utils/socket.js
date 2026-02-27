import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL 

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("🟢 Connected to socket:", socket.id);
});

socket.on("disconnect", () => {
  console.log("🔴 Disconnected from socket");
});