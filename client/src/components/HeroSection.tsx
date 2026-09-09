import { backendUrl } from "../config/env";

type HeroSectionProps = {
  nodeId: string;
  status: "Connected" | "Connecting..." | "Disconnected";
};

export function HeroSection({ nodeId, status }: HeroSectionProps) {
  const isOnline = status === "Connected";

  return (
    <header className="top-bar">
      <div className="brand-group">
        <div className="logo-badge">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
        </div>
        <div>
          <h1 className="brand-title">Distributed Chat Lab</h1>
          <p className="brand-subtitle">Multi-Node Realtime Consensus Playground</p>
        </div>
      </div>

      <div className="system-telemetry">
        <div className="telemetry-chip">
          <span className="telemetry-label">Active Node</span>
          <code className="telemetry-value highlight">{nodeId}</code>
        </div>

        <div className="telemetry-chip">
          <span className="telemetry-label">Cluster State</span>
          <span className={`status-pill ${isOnline ? "online" : "offline"}`}>
            <span className="pulse-dot"></span>
            {status}
          </span>
        </div>

        <a
          href={`${backendUrl}/docs`}
          target="_blank"
          rel="noreferrer"
          className="swagger-link-btn"
          title="Open API Swagger Documentation"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          Swagger Docs
        </a>
      </div>
    </header>
  );
}
