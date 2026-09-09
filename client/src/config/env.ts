export const backendUrl =
  import.meta.env.VITE_BACKEND_URL ?? "http://localhost:3000";

export const wsUrl = backendUrl.replace(/^http/, "ws");
