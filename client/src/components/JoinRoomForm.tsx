import { FormEvent, useState } from "react";

type JoinRoomFormProps = {
  currentRoom: string;
  currentUser: string;
  onJoin: (user: string, roomId: string) => void;
};

const SUGGESTED_ROOMS = ["general", "distributed-consensus", "replication", "benchmarks"];

export function JoinRoomForm({
  currentRoom,
  currentUser,
  onJoin,
}: JoinRoomFormProps) {
  const [user, setUser] = useState(currentUser);
  const [roomId, setRoomId] = useState(currentRoom);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (user.trim() && roomId.trim()) {
      onJoin(user.trim(), roomId.trim());
    }
  }

  function handleSelectRoom(selected: string) {
    setRoomId(selected);
    onJoin(user.trim() || "anonymous", selected);
  }

  return (
    <div className="session-card">
      <div className="card-header">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <h3>Client Identity & Channel</h3>
      </div>

      <form className="join-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="user-input">Handle</label>
          <input
            id="user-input"
            value={user}
            onChange={(event) => setUser(event.target.value)}
            placeholder="e.g. node_explorer"
          />
        </div>

        <div className="input-group">
          <label htmlFor="room-input">Active Channel</label>
          <div className="channel-input-wrapper">
            <span className="hash-prefix">#</span>
            <input
              id="room-input"
              value={roomId}
              onChange={(event) => setRoomId(event.target.value)}
              placeholder="channel-name"
            />
          </div>
        </div>

        <button type="submit" className="join-submit-btn">
          Switch Channel
        </button>
      </form>

      <div className="channel-presets">
        <span className="presets-label">Suggested Topics:</span>
        <div className="chips-row">
          {SUGGESTED_ROOMS.map((room) => (
            <button
              key={room}
              type="button"
              className={`channel-chip ${room === currentRoom ? "active" : ""}`}
              onClick={() => handleSelectRoom(room)}
            >
              #{room}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
