import type { WebSocket } from "ws";
import { isClientEvent, type ClientEvent } from "../../../shared/protocol";
import { memoryStore } from "../state/memory-store";
import { roomService } from "../services/room.service";
import { chatService } from "../services/chat.service";
import { sendEvent } from "./sender";

export function handleConnection(socket: WebSocket): void {
  const sessionId = crypto.randomUUID();

  const session = {
    id: sessionId,
    user: "anonymous",
    roomId: null,
    socket,
  };

  memoryStore.addSession(session);

  sendEvent(socket, {
    type: "system",
    message: "Connected. Join a room to start chatting.",
  });

  socket.on("message", (raw) => {
    const currentSession = memoryStore.getSession(sessionId);
    if (!currentSession) {
      return;
    }

    const payload = parseClientEvent(raw.toString());
    if (!payload) {
      sendEvent(socket, {
        type: "error",
        message: "Invalid event payload.",
      });
      return;
    }

    if (payload.type === "join_room") {
      const nextUser = payload.user.trim() || "anonymous";
      const nextRoomId = payload.roomId.trim() || "general";
      roomService.joinRoom(currentSession, nextUser, nextRoomId);
      return;
    }

    if (payload.type === "send_message") {
      chatService.sendMessage(currentSession, payload.text);
    }
  });

  socket.on("close", () => {
    const currentSession = memoryStore.getSession(sessionId);
    if (!currentSession) {
      return;
    }

    roomService.leaveRoom(currentSession);
    memoryStore.removeSession(sessionId);
  });
}

function parseClientEvent(raw: string): ClientEvent | null {
  try {
    const value = JSON.parse(raw);
    if (!isClientEvent(value)) {
      return null;
    }
    return value;
  } catch {
    return null;
  }
}
