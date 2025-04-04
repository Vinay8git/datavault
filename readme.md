# Distributed File Scheduler System (In Progress)

This is a **distributed file processing system** that delegates file storage tasks to multiple worker microservices via **gRPC**. The architecture is modular, with shared protocol definitions in a `common` module and distinct roles for scheduling and file storage.

> **Note**: This project is **under development**. The architecture, components, and implementation approaches may change as the system evolves.

---

## Microservices Overview

### `common/`

- Contains shared **`.proto` files** used for gRPC communication between the services.
- Defines messages and service contracts in Protocol Buffers.
- Intended to be imported as a dependency in both the `scheduler` and `worker` services.

### `scheduler/`

- Manages incoming files to be stored.
- Decides which worker should store a file.
- Uses gRPC stubs from `common` to communicate with workers.
- Keeps a temporary in-memory cache of files and metadata (may move to DB later).

### `worker/`

- Listens for gRPC requests to store files.
- Writes file content to disk (can be later extended to S3, DB, etc.).
- Each worker runs independently with its own local storage.
- Imports the generated stubs from the `common` module.

---

## Tech Stack

- **Java 17**
- **Spring Boot**
- **gRPC + Protocol Buffers**
- **Docker & Docker Compose**
- **Maven**

---

## Folder Structure

```bash
.
├── common/
│   └── src/main/proto/worker.proto
│
├── scheduler/
│   ├── src/main/java/com/scheduler/...
│   └── resources/application.properties
│
├── worker/
│   ├── src/main/java/com/worker/...
│   └── resources/application.properties
│
└── docker-compose.yml
```
