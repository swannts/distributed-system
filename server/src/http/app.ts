import express, { type Express } from "express";
import swaggerUi from "swagger-ui-express";
import { config } from "../config/env";
import { memoryStore } from "../state/memory-store";
import { apiRouter } from "./routes";
import { swaggerDocument } from "../docs/swagger";

export function createExpressApp(): Express {
  const app = express();

  app.use(express.json());

  // Root health endpoint (for backward compatibility & load balancer checks)
  app.get("/health", (_req, res) => {
    res.json({
      ok: true,
      nodeId: config.nodeId,
      connectedClients: memoryStore.getSessionCount(),
      rooms: memoryStore.getRoomCount(),
    });
  });

  // REST API routes
  app.use("/api", apiRouter);

  // Swagger Documentation
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Swagger JSON raw spec
  app.get("/docs.json", (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerDocument);
  });

  // Informative root landing for pure API mode
  app.get("/", (_req, res) => {
    res.json({
      name: "Distributed Chat API",
      nodeId: config.nodeId,
      health: "/health",
      api: "/api",
      docs: "/docs",
      ws: `ws://localhost:${config.port}`,
    });
  });

  return app;
}
