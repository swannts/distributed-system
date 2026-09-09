import type { ServerEvent } from "../../../shared/protocol";
import type { ClientSession } from "../types/session";
import { memoryStore, MemoryStore } from "../state/memory-store";
import { sendEvent } from "../websocket/sender";

export class RoomService {
  constructor(private store: MemoryStore = memoryStore) {}

  broadcastToRoom(roomId: string, event: ServerEvent): void {
    const memberIds = this.store.getRoomMemberIds(roomId);
    for (const memberId of memberIds) {
      const session = this.store.getSession(memberId);
      if (session) {
        sendEvent(session.socket, event);
      }
    }
  }

  joinRoom(session: ClientSession, nextUser: string, nextRoomId: string): void {
    // Leave previous room if any
    this.leaveRoom(session);

    session.user = nextUser;
    session.roomId = nextRoomId;

    this.store.joinRoom(session.id, nextRoomId);

    // Send history to user joining
    sendEvent(session.socket, {
      type: "history",
      roomId: nextRoomId,
      messages: this.store.getRoomHistory(nextRoomId),
    });

    // Notify all members in room
    this.broadcastToRoom(nextRoomId, {
      type: "presence",
      roomId: nextRoomId,
      message: `${nextUser} joined ${nextRoomId}`,
      members: this.store.getRoomMembers(nextRoomId),
    });
  }

  leaveRoom(session: ClientSession): void {
    if (!session.roomId) {
      return;
    }

    const roomId = session.roomId;
    const user = session.user;

    this.store.leaveRoom(session.id, roomId);
    session.roomId = null;

    // Notify remaining members
    this.broadcastToRoom(roomId, {
      type: "presence",
      roomId,
      message: `${user} left ${roomId}`,
      members: this.store.getRoomMembers(roomId),
    });
  }

  getRoomMembers(roomId: string): string[] {
    return this.store.getRoomMembers(roomId);
  }
}

export const roomService = new RoomService();
