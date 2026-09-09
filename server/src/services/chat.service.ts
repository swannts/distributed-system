import type { ChatMessage } from "../../../shared/protocol";
import type { ClientSession } from "../types/session";
import { memoryStore, MemoryStore } from "../state/memory-store";
import { roomService, RoomService } from "./room.service";
import { sendEvent } from "../websocket/sender";

export class ChatService {
  constructor(
    private store: MemoryStore = memoryStore,
    private roomSvc: RoomService = roomService,
  ) {}

  sendMessage(session: ClientSession, text: string): void {
    if (!session.roomId) {
      sendEvent(session.socket, {
        type: "error",
        message: "Join a room before sending messages.",
      });
      return;
    }

    const trimmedText = text.trim();
    if (!trimmedText) {
      return;
    }

    const message: ChatMessage = {
      id: crypto.randomUUID(),
      roomId: session.roomId,
      user: session.user,
      text: trimmedText,
      sentAt: new Date().toISOString(),
    };

    this.store.addMessage(session.roomId, message);

    this.roomSvc.broadcastToRoom(session.roomId, {
      type: "chat_message",
      message,
    });
  }
}

export const chatService = new ChatService();
