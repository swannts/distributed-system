# Distributed Chat System

A hands-on distributed-systems project built with a React frontend and an Express backend.

## Why this project

Chat makes distributed-systems ideas concrete:

- many clients connected at the same time
- events broadcast to multiple users
- presence and disconnect handling
- state that starts on one server and later must span many servers

## Stack

- `React` for the browser client
- `Express` for the HTTP backend
- `WebSocket` for real-time chat events
- `TypeScript` across frontend, backend, and shared protocol types

## Learning roadmap

### Phase 1: Single-node chat

Build one Express server and one React client with:

- room join flow
- live chat messages
- in-memory message history
- basic presence updates

Concepts:

- connection lifecycle
- room fan-out
- shared state in one process

### Phase 2: Multi-node chat

Run multiple backend nodes and make them exchange room events.

Concepts:

- horizontal scaling
- cross-node message propagation
- why in-memory state breaks across nodes

### Phase 3: Shared pub/sub

Add Redis pub/sub so all backend nodes receive the same room events.

Concepts:

- brokered messaging
- eventual consistency
- decoupling producers and consumers

### Phase 4: Presence and heartbeats

Track online users and expire stale sessions.

Concepts:

- heartbeat design
- liveness detection
- timeouts and cleanup

### Phase 5: Persistence and recovery

Store messages so history survives process restarts.

Concepts:

- durability
- replay
- recovery after failure

### Phase 6: Delivery guarantees

Add message IDs, retries, and deduplication.

Concepts:

- idempotency
- at-least-once delivery
- duplicate suppression

## Project layout

- `client/` React app powered by Vite
- `server/` Express and WebSocket backend
- `shared/` protocol types shared by frontend and backend

## Getting started

1. Install dependencies with `npm install`
2. Start both apps with `npm run dev`
3. Open the React client at `http://localhost:5173`
4. The Express backend runs at `http://localhost:3000`

## Current phase

The repo currently includes Phase 1 and is intentionally small so we can grow it together into a distributed system instead of jumping straight to infrastructure complexity.
