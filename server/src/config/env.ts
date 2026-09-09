import path from "path";

export const config = {
  port: Number(process.env.PORT ?? 3000),
  nodeId: process.env.NODE_ID ?? `node-${crypto.randomUUID().slice(0, 8)}`,
  maxHistoryPerRoom: 25,
};
