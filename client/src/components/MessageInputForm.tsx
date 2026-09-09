import { FormEvent, useState } from "react";

type MessageInputFormProps = {
  onSend: (text: string) => void;
  currentRoom: string;
};

export function MessageInputForm({ onSend, currentRoom }: MessageInputFormProps) {
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = message.trim();
    if (!text) {
      return;
    }

    onSend(text);
    setMessage("");
  }

  return (
    <form className="message-form-container" onSubmit={handleSubmit}>
      <div className="input-bar">
        <span className="room-indicator">#{currentRoom}</span>
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          autoComplete="off"
          placeholder={`Broadcast event to #${currentRoom}... (Press Enter)`}
        />
        <button
          type="submit"
          className="send-action-btn"
          disabled={!message.trim()}
          aria-label="Send message"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </form>
  );
}
