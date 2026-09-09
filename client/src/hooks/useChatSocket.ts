import { useEffect, useRef, useState, useCallback } from "react";
import { wsUrl, backendUrl } from "../config/env";
import type { FeedEntry, ServerEvent } from "../types/chat";

export function useChatSocket() {
  const [status, setStatus] = useState<"Connected" | "Connecting..." | "Disconnected">("Connecting...");
  const [members, setMembers] = useState<string[]>([]);
  const [feed, setFeed] = useState<FeedEntry[]>([]);
  const [currentUser, setCurrentUser] = useState("swann");
  const [currentRoom, setCurrentRoom] = useState("general");
  const [nodeId, setNodeId] = useState<string>("detecting...");
  const socketRef = useRef<WebSocket | null>(null);

  // Fetch node stats from backend REST API
  useEffect(() => {
    fetch(`${backendUrl}/health`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.nodeId) {
          setNodeId(data.nodeId);
        }
      })
      .catch(() => setNodeId("standalone"));
  }, []);

  const appendSystemLine = useCallback((text: string) => {
    setFeed((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        kind: "system",
        text,
        sentAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }, []);

  const appendMessage = useCallback((user: string, text: string, id: string, sentAt?: string) => {
    setFeed((current) => [
      ...current,
      {
        id,
        kind: "message",
        user,
        text,
        sentAt: sentAt
          ? new Date(sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }, []);

  useEffect(() => {
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.addEventListener("open", () => {
      setStatus("Connected");
    });

    socket.addEventListener("close", () => {
      setStatus("Disconnected");
    });

    socket.addEventListener("message", (event) => {
      try {
        const payload = JSON.parse(event.data) as ServerEvent;

        if (payload.type === "system" || payload.type === "error") {
          appendSystemLine(payload.message);
          return;
        }

        if (payload.type === "history") {
          setFeed([
            {
              id: `history-${payload.roomId}-${Date.now()}`,
              kind: "system",
              text: `Connected to #${payload.roomId}`,
              sentAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
            ...payload.messages.map((entry) => ({
              id: entry.id,
              kind: "message" as const,
              user: entry.user,
              text: entry.text,
              sentAt: new Date(entry.sentAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            })),
          ]);
          return;
        }

        if (payload.type === "presence") {
          appendSystemLine(payload.message);
          setMembers(payload.members);
          return;
        }

        if (payload.type === "chat_message") {
          appendMessage(
            payload.message.user,
            payload.message.text,
            payload.message.id,
            payload.message.sentAt,
          );
        }
      } catch (err) {
        console.error("Failed to parse incoming WebSocket message", err);
      }
    });

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [appendSystemLine, appendMessage]);

  const joinRoom = useCallback((user: string, roomId: string) => {
    setCurrentUser(user);
    setCurrentRoom(roomId);
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: "join_room",
          user,
          roomId,
        }),
      );
    }
  }, []);

  const sendMessage = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: "send_message",
          text: trimmed,
        }),
      );
    }
  }, []);

  return {
    status,
    members,
    feed,
    currentUser,
    currentRoom,
    nodeId,
    joinRoom,
    sendMessage,
  };
}
