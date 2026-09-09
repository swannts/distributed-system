export type {
  ChatMessage,
  ServerEvent,
  ClientEvent,
  JoinRoomEvent,
  SendMessageEvent,
} from "../../../shared/protocol";

export type FeedEntry =
  | {
      id: string;
      kind: "system";
      text: string;
      sentAt?: string;
    }
  | {
      id: string;
      kind: "message";
      user: string;
      text: string;
      sentAt: string;
    };
