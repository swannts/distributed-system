import type { ChatMessage } from "../../../shared/protocol";
import type { ClientSession } from "../types/session";
import { config } from "../config/env";

export class MemoryStore {
  private rooms = new Map<string, Set<string>>();
  private sessions = new Map<string, ClientSession>();
  private history = new Map<string, ChatMessage[]>();

  // Session management
  addSession(session: ClientSession): void {
    this.sessions.set(session.id, session);
  }

  getSession(sessionId: string): ClientSession | undefined {
    return this.sessions.get(sessionId);
  }

  removeSession(sessionId: string): ClientSession | undefined {
    const session = this.sessions.get(sessionId);
    if (session) {
      this.sessions.delete(sessionId);
    }
    return session;
  }

  getSessionCount(): number {
    return this.sessions.size;
  }

  // Room management
  joinRoom(sessionId: string, roomId: string): void {
    let roomMembers = this.rooms.get(roomId);
    if (!roomMembers) {
      roomMembers = new Set();
      this.rooms.set(roomId, roomMembers);
    }
    roomMembers.add(sessionId);
  }

  leaveRoom(sessionId: string, roomId: string): void {
    const roomMembers = this.rooms.get(roomId);
    if (!roomMembers) {
      return;
    }
    roomMembers.delete(sessionId);
    if (roomMembers.size === 0) {
      this.rooms.delete(roomId);
    }
  }

  getRoomMemberIds(roomId: string): Set<string> {
    return this.rooms.get(roomId) ?? new Set();
  }

  getRoomMembers(roomId: string): string[] {
    const memberIds = this.getRoomMemberIds(roomId);
    const members: string[] = [];

    for (const memberId of memberIds) {
      const session = this.sessions.get(memberId);
      if (session) {
        members.push(session.user);
      }
    }

    return members.sort();
  }

  getRoomCount(): number {
    return this.rooms.size;
  }

  getActiveRooms(): { roomId: string; memberCount: number }[] {
    const list: { roomId: string; memberCount: number }[] = [];
    for (const [roomId, members] of this.rooms.entries()) {
      list.push({ roomId, memberCount: members.size });
    }
    return list;
  }

  // Message history
  getRoomHistory(roomId: string): ChatMessage[] {
    return this.history.get(roomId) ?? [];
  }

  addMessage(roomId: string, message: ChatMessage): void {
    const current = this.history.get(roomId) ?? [];
    current.push(message);
    this.history.set(roomId, current.slice(-config.maxHistoryPerRoom));
  }
}

export const memoryStore = new MemoryStore();
