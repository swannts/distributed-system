import { Router } from "express";
import { config } from "../config/env";
import { memoryStore } from "../state/memory-store";

export const apiRouter = Router();

apiRouter.get("/health", (_req, res) => {
  res.json({
    ok: true,
    nodeId: config.nodeId,
    connectedClients: memoryStore.getSessionCount(),
    rooms: memoryStore.getRoomCount(),
  });
});

apiRouter.get("/rooms", (_req, res) => {
  res.json({
    rooms: memoryStore.getActiveRooms(),
  });
});

apiRouter.get("/rooms/:roomId/members", (req, res) => {
  const { roomId } = req.params;
  res.json({
    roomId,
    members: memoryStore.getRoomMembers(roomId),
  });
});

apiRouter.get("/rooms/:roomId/history", (req, res) => {
  const { roomId } = req.params;
  res.json({
    roomId,
    messages: memoryStore.getRoomHistory(roomId),
  });
});
