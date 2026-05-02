# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start                  # Dev server on :4200
npm run build              # Production build (--base-href=/browser)
npm test                   # Run all tests (Karma/Jasmine/Chrome)
npm run serve:ssr:ui        # Serve the SSR build (node dist/ui/server/server.mjs)
```

Run a single test file:
```bash
npx ng test --include="**/chat.service.spec.ts"
```

## Architecture

### Routing

All routes are lazy-loaded standalone components defined in `src/app/app.routes.ts`. Current routes: `/home`, `/chat`, `/timeline`, `/terminal`, `/coming-soon`. Unmatched routes redirect to `/home`. The terminal route carries `data: { mode: 'fullscreen' }` which its component reads to switch between fullscreen and panel modes.

### Standalone Components + Signals

All components use `standalone: true` — no NgModules anywhere. State is managed with Angular signals (`signal()`, not RxJS subjects or NgRx). Services expose signals directly; components read them with `service.signalName()`. The exception is `ChatComponent`, which uses plain booleans for loading state.

### Services & API

Services in `src/app/services/` call the NestJS API hardcoded to `http://localhost:3000`. There are no environment configuration files and no HTTP interceptors. Three services exist:

- `ChatService` — `GET /ask?prompt=` → `{ answer: string }`
- `TimelineService` — `GET /projects` → `TimelineEntry[]`
- `AiConfigService` — `GET /ai-config` → `{ provider, chatModel, embeddingModel }` — uses signals for loading/error state

Shared DTOs live in `src/app/dto/`.

### Custom RxJS Operator

`src/app/operators/typewriter.operator.ts` — a custom pipeable operator that takes a full string and re-emits it character-by-character with human-like delays (longer pauses after `.!?`, shorter after `,;:`). Used in `ChatComponent` for the AI response typewriter effect.

### SSR Constraints

When adding browser-only code (DOM APIs, `window`, `IntersectionObserver`), follow the patterns already in use:
- `afterNextRender()` to defer execution until client hydration (see `TimelineComponent`)
- `isPlatformBrowser()` guard for imperative DOM access (see `TerminalComponent`)

### Styling

- Global SCSS variables: `src/theme/var.style.scss` — primary color `#7243FF`, background `rgb(31 31 31)`, text `#FFFFFF`
- Responsive mixins: `src/theme/mixin.responsive.scss`
- Typewriter animation: `src/theme/typewriter.scss`
- All components use scoped SCSS; global baseline in `src/styles.scss` (Poppins font, dark theme, custom scrollbar)

### Third-Party UI

`@omnedia/ngx-timeline` (v3) is used inside `TimelineComponent` for the visual timeline layout.
