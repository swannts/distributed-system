import type { Server as HttpServer } from "http";
import { WebSocketServer } from "ws";
import { handleConnection } from "./handler";

export function createWebSocketServer(server: HttpServer): WebSocketServer {
  const wsServer = new WebSocketServer({ server });
  wsServer.on("connection", handleConnection);
  return wsServer;
}
