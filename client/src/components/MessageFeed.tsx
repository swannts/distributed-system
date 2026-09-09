import { forwardRef } from "react";
import type { FeedEntry } from "../types/chat";

type MessageFeedProps = {
  feed: FeedEntry[];
  currentUser: string;
};

export const MessageFeed = forwardRef<HTMLElement, MessageFeedProps>(
  ({ feed, currentUser }, ref) => {
    return (
      <section className="feed-stream" ref={ref} aria-live="polite">
        {feed.length === 0 ? (
          <div className="empty-feed-placeholder">
            <div className="radar-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a10 10 0 0 1 10 10" />
                <path d="M12 6a6 6 0 0 1 6 6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </div>
            <p className="placeholder-title">No messages broadcast yet</p>
            <p className="placeholder-desc">
              Events sent here are fanned out to all connected peers in this room.
            </p>
          </div>
        ) : (
          feed.map((entry) => {
            if (entry.kind === "system") {
              return (
                <div key={entry.id} className="system-pill-row">
                  <div className="system-pill">
                    <span className="system-dot"></span>
                    <span className="system-text">{entry.text}</span>
                    {entry.sentAt && <span className="system-time">{entry.sentAt}</span>}
                  </div>
                </div>
              );
            }

            const isSelf = entry.user === currentUser;

            return (
              <div
                key={entry.id}
                className={`bubble-wrapper ${isSelf ? "self-aligned" : "peer-aligned"}`}
              >
                {!isSelf && (
                  <div className="peer-avatar">
                    {entry.user.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className={`message-bubble ${isSelf ? "bubble-self" : "bubble-peer"}`}>
                  <div className="bubble-meta">
                    <span className="bubble-author">{isSelf ? "You" : entry.user}</span>
                    <span className="bubble-time">{entry.sentAt}</span>
                  </div>
                  <div className="bubble-body">{entry.text}</div>
                </div>
              </div>
            );
          })
        )}
      </section>
    );
  },
);

MessageFeed.displayName = "MessageFeed";
