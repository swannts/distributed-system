import { useChatSocket } from "./hooks/useChatSocket";
import { useAutoScroll } from "./hooks/useAutoScroll";
import { HeroSection } from "./components/HeroSection";
import { JoinRoomForm } from "./components/JoinRoomForm";
import { RoomMeta } from "./components/RoomMeta";
import { MessageFeed } from "./components/MessageFeed";
import { MessageInputForm } from "./components/MessageInputForm";

export function App() {
  const {
    status,
    members,
    feed,
    currentUser,
    currentRoom,
    nodeId,
    joinRoom,
    sendMessage,
  } = useChatSocket();

  const feedRef = useAutoScroll<HTMLElement>(feed);

  return (
    <div className="lab-viewport">
      <HeroSection nodeId={nodeId} status={status} />

      <main className="lab-workspace">
        <aside className="lab-sidebar">
          <JoinRoomForm
            currentRoom={currentRoom}
            currentUser={currentUser}
            onJoin={joinRoom}
          />
          <RoomMeta
            members={members}
            currentRoom={currentRoom}
            currentUser={currentUser}
            nodeId={nodeId}
          />
        </aside>

        <section className="lab-stream-card">
          <div className="stream-header">
            <div className="stream-channel-info">
              <span className="hash-tag">#</span>
              <h2 className="stream-title">{currentRoom}</h2>
              <span className="live-pill">Live Stream</span>
            </div>
            <div className="stream-quick-stats">
              <span>{members.length} peer{members.length === 1 ? "" : "s"} online</span>
            </div>
          </div>

          <MessageFeed
            feed={feed}
            currentUser={currentUser}
            ref={feedRef}
          />

          <MessageInputForm
            onSend={sendMessage}
            currentRoom={currentRoom}
          />
        </section>
      </main>
    </div>
  );
}
