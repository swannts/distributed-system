import { WebSocket } from "ws";

export type ClientSession = {
  id: string;
  user: string;
  roomId: string | null;
  socket: WebSocket;
};
