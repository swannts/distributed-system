export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Distributed Chat System Backend API",
    version: "1.0.0",
    description:
      "REST and WebSocket API for the distributed chat nodes. Provides node health, room metrics, active presence inspection, and real-time event protocol specifications.",
  },
  servers: [
    {
      url: "/",
      description: "Current backend node",
    },
  ],
  paths: {
    "/health": {
      get: {
        summary: "Node health and statistics",
        description:
          "Returns the status of this node, its unique nodeId, connected clients count, and active rooms count.",
        responses: {
          "200": {
            description: "Node health status",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: true },
                    nodeId: { type: "string", example: "node-1" },
                    connectedClients: { type: "integer", example: 4 },
                    rooms: { type: "integer", example: 2 },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/rooms": {
      get: {
        summary: "List active rooms",
        description:
          "Returns all currently active rooms on this node and their member counts.",
        responses: {
          "200": {
            description: "List of rooms",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    rooms: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          roomId: { type: "string", example: "general" },
                          memberCount: { type: "integer", example: 3 },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/rooms/{roomId}/members": {
      get: {
        summary: "Get room members",
        description: "Returns all usernames currently active in the given room on this node.",
        parameters: [
          {
            name: "roomId",
            in: "path",
            required: true,
            schema: { type: "string" },
            example: "general",
          },
        ],
        responses: {
          "200": {
            description: "Members list",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    roomId: { type: "string", example: "general" },
                    members: {
                      type: "array",
                      items: { type: "string" },
                      example: ["alice", "bob"],
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/rooms/{roomId}/history": {
      get: {
        summary: "Get recent room messages",
        description: "Returns recent messages stored in memory for the specified room.",
        parameters: [
          {
            name: "roomId",
            in: "path",
            required: true,
            schema: { type: "string" },
            example: "general",
          },
        ],
        responses: {
          "200": {
            description: "Room history",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    roomId: { type: "string", example: "general" },
                    messages: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string", example: "uuid-1234" },
                          roomId: { type: "string", example: "general" },
                          user: { type: "string", example: "alice" },
                          text: { type: "string", example: "Hello distributed world!" },
                          sentAt: { type: "string", format: "date-time" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      WebSocketProtocol: {
        type: "object",
        description:
          "WebSocket protocol messages exchanged over ws://<host>:<port>",
        properties: {
          clientEvents: {
            type: "object",
            properties: {
              join_room: {
                type: "object",
                properties: {
                  type: { type: "string", example: "join_room" },
                  user: { type: "string", example: "alice" },
                  roomId: { type: "string", example: "general" },
                },
              },
              send_message: {
                type: "object",
                properties: {
                  type: { type: "string", example: "send_message" },
                  text: { type: "string", example: "Hi everyone!" },
                },
              },
            },
          },
          serverEvents: {
            type: "object",
            properties: {
              system: {
                type: "object",
                properties: {
                  type: { type: "string", example: "system" },
                  message: { type: "string", example: "Connected. Join a room to start chatting." },
                },
              },
              chat_message: {
                type: "object",
                properties: {
                  type: { type: "string", example: "chat_message" },
                  message: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      roomId: { type: "string" },
                      user: { type: "string" },
                      text: { type: "string" },
                      sentAt: { type: "string" },
                    },
                  },
                },
              },
              presence: {
                type: "object",
                properties: {
                  type: { type: "string", example: "presence" },
                  roomId: { type: "string" },
                  message: { type: "string" },
                  members: { type: "array", items: { type: "string" } },
                },
              },
              history: {
                type: "object",
                properties: {
                  type: { type: "string", example: "history" },
                  roomId: { type: "string" },
                  messages: { type: "array", items: { type: "object" } },
                },
              },
            },
          },
        },
      },
    },
  },
};
