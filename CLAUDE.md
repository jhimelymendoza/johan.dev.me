# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack AI-powered portfolio/chat application:
- **`ui/`** — Angular 19 frontend with SSR
- **`api/`** — NestJS 11 backend with MongoDB and Google GenAI

## Commands

### UI (Angular)
```bash
cd ui
npm start              # Dev server (ng serve)
npm run build          # Production build (--base-href=/browser)
npm test               # Run tests (Karma/Jasmine)
```

### API (NestJS)
```bash
cd api
npm run start:dev      # Dev server with watch mode
npm run build          # Production build
npm test               # Run unit tests (Jest)
npm run test:e2e       # Run e2e tests
npm run lint           # ESLint with auto-fix
```

## Architecture

### Frontend (`ui/src/app/`)
- Standalone Angular components with lazy-loaded routing: `/home`, `/chat`, `/timeline`
- `services/chat.service.ts` — handles all API communication
- `dto/` — shared TypeScript interfaces/DTOs
- SSR enabled via Angular SSR + Express

### Backend (`api/src/`)
- Single-module NestJS app: `AppModule` → `AppController` → `AppService`
- **MongoDB** via `@nestjs/mongoose` — schemas in `project/` (project.schema.ts, skills.schema.ts)
- **Google GenAI** (`@google/genai`) — integrated via `ConfigModule` and dependency injection
- **Embeddings** — cosine similarity (`compute-cosine-similarity`) for semantic search

Key API endpoints:
- `GET /ask?prompt=` — query with embedding-based semantic search
- `GET /compare?question=` — compare questions using embeddings
- `PUT /set-embedding-to-skills/:id` — generate and store embeddings for a project

### Environment Variables (API)
- `MONGO_DB` — MongoDB connection string
- `GENAI_API_KEY` — Google GenAI API key

### Deployment
- **Frontend** → Vercel (triggered on push to `main`)
- **Backend** → Render (triggered via webhook on push to `main`)
- CI/CD via `.github/workflows/production.yaml`
