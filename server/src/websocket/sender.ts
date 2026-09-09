import { WebSocket } from "ws";
import type { ServerEvent } from "../../../shared/protocol";

export function sendEvent(socket: WebSocket, event: ServerEvent): void {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(event));
  }
}
