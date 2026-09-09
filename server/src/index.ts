import { createServer } from "http";
import { config } from "./config/env";
import { createExpressApp } from "./http/app";
import { createWebSocketServer } from "./websocket/server";

const app = createExpressApp();
const httpServer = createServer(app);
createWebSocketServer(httpServer);

httpServer.listen(config.port, () => {
  console.log(
    `[${config.nodeId}] chat server listening on http://localhost:${config.port}`,
  );
});
