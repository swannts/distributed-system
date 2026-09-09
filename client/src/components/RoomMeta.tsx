import { backendUrl } from "../config/env";

type RoomMetaProps = {
  members: string[];
  currentRoom: string;
  currentUser: string;
  nodeId: string;
};

export function RoomMeta({ members, currentRoom, currentUser, nodeId }: RoomMetaProps) {
  return (
    <div className="telemetry-card">
      <div className="card-header">
        <div className="header-title">
          <span className="live-pulse"></span>
          <h3>Channel Presence (#{currentRoom})</h3>
        </div>
        <span className="counter-badge">{members.length} peers</span>
      </div>

      <div className="members-container">
        {members.length === 0 ? (
          <p className="empty-hint">Waiting for room heartbeat...</p>
        ) : (
          <div className="members-grid">
            {members.map((member) => {
              const isSelf = member === currentUser;
              return (
                <div key={member} className={`member-tag ${isSelf ? "self" : ""}`}>
                  <span className="avatar-disc">{member.slice(0, 2).toUpperCase()}</span>
                  <span className="member-name">{member}</span>
                  {isSelf && <span className="you-pill">you</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="node-footer">
        <div className="meta-metric">
          <span className="metric-key">Host Node:</span>
          <span className="metric-val">{nodeId}</span>
        </div>
        <div className="meta-metric">
          <span className="metric-key">Gateway:</span>
          <span className="metric-val">{backendUrl.replace(/https?:\/\//, "")}</span>
        </div>
      </div>
    </div>
  );
}
