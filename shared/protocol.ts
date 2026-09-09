export type JoinRoomEvent = {
  type: "join_room";
  roomId: string;
  user: string;
};

export type SendMessageEvent = {
  type: "send_message";
  text: string;
};

export type ClientEvent = JoinRoomEvent | SendMessageEvent;

export type ChatMessage = {
  id: string;
  roomId: string;
  user: string;
  text: string;
  sentAt: string;
};

export type ServerEvent =
  | {
      type: "system";
      message: string;
    }
  | {
      type: "error";
      message: string;
    }
  | {
      type: "history";
      roomId: string;
      messages: ChatMessage[];
    }
  | {
      type: "presence";
      roomId: string;
      message: string;
      members: string[];
    }
  | {
      type: "chat_message";
      message: ChatMessage;
    };

export function isClientEvent(value: unknown): value is ClientEvent {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  if (candidate.type === "join_room") {
    return (
      typeof candidate.roomId === "string" &&
      typeof candidate.user === "string"
    );
  }

  if (candidate.type === "send_message") {
    return typeof candidate.text === "string";
  }

  return false;
}
