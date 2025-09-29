<!-- .github/copilot-instructions.md -->

# Guidance for AI coding agents working on this repository

This file contains concise, actionable information an automated coding assistant needs to be productive in this Next.js + Supabase starter project.

High-level architecture

- Framework: Next.js (App Router). Look at `app/` for routes and layouts.
- Auth: Supabase Auth integrated with cookie-based sessions using `@supabase/ssr`.
  - Client-side helper: `lib/supabase/client.ts` (createBrowserClient)
  - Server-side helper: `lib/supabase/server.ts` (createServerClient — create a fresh client per request)
  - Middleware session sync: `lib/supabase/middleware.ts` and `middleware.ts` — this enforces redirects to `/auth/login` for unauthenticated paths.
  - API route that sets cookies after Supabase auth: `app/api/auth/set-session/route.ts`. It sets `sb-access-token` and `sb-refresh-token` cookies.

Key directories & their responsibilities

- `app/` — Next.js App Router pages, layouts, API routes. Prefer editing server components here for SSR logic.
- `components/` — UI and client components. Many start with `"use client"`. When adding interactive UI, keep it under `components/` and mark as client when necessary.
- `lib/` — utilities, typed services, and Supabase clients. Look in `lib/services/*` for canonical data-access patterns (e.g. `product.ts`, `order.ts`).
- `context/` — React Context providers (notably `AuthProvider.tsx` which uses the client supabase instance and `fetchCurrentProfile`).

Important patterns and conventions (concrete)

- Supabase clients

  - Server code must call `createServerClient()` inside each request handler (do not reuse a global client). See `lib/supabase/server.ts` and `lib/supabase/middleware.ts`.
  - Browser code can import `supabase` from `lib/supabase/client.ts` or call `createClient()`.
  - Never run code between `createServerClient()` and `supabase.auth.getClaims()` in middleware — the middleware file explicitly warns this can cause session bugs.

- Cookie names and auth flow

  - Auth session tokens are set via `app/api/auth/set-session/route.ts` using cookie names `sb-access-token` and `sb-refresh-token`. Middleware expects those cookies when calling `getClaims()`.

- Server vs Client components

  - Files with `"use client"` at top are interactive/reactive components and may import browser-only APIs. Server components should avoid importing `lib/supabase/client` directly.
  - Use `lib/supabase/server.ts` from server components or server actions only.

- Services pattern
  - Data access is centralized in `lib/services/*.ts`. They use `supabase` from the browser client for client-side calls and the server client for server-side calls as appropriate.
  - Service functions normalize Supabase rows into typed application shapes — follow this approach for new tables (see `lib/services/product.ts`).

Build / dev / lint commands (how developers run things)

- Run dev server (uses Turbopack by default): `npm run dev` (script: `next dev --turbopack`).
- Build: `npm run build` (next build)
- Start production server: `npm run start` (next start)
- Lint: `npm run lint` (next lint)

Environment and secrets

- Required env vars (used in code):
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY
  - VERCEL_URL (optional for metadata)
- Many files guard against missing env vars (see `lib/supabase/middleware.ts` — it checks `hasEnvVars`). If env vars are missing, middleware may short-circuit.

Project-specific conventions and tips for code changes

- When adding server-side Supabase access, use the `createServerClient()` wrapper in `lib/supabase/server.ts` or call it directly in API routes/middleware. Do not store server client in module scope.
- When editing middleware, preserve the pattern where you return the same NextResponse object that contains the cookies — see the long comment in `lib/supabase/middleware.ts`.
- Use `lib/services/*` for data access; return normalized JS objects rather than raw DB rows.
- Follow the app router's file structure when adding pages: use `app/<route>/page.tsx` and `app/<route>/layout.tsx` as required.
- UI components use shadcn/ui patterns and `components.json` for shadcn configuration. Keep styling consistent with Tailwind and existing `components/ui/*` primitives.

Testing & verification guidance for automated edits

- After changes, run `npm run dev` locally to smoke test interactive behavior (auth flows and middleware). On Windows PowerShell, run:

```powershell
npm run dev
```

- Quick checks to run in PRs: build (`npm run build`) and lint (`npm run lint`).

Files to reference when uncertain

- Auth & middleware: `middleware.ts`, `lib/supabase/middleware.ts`, `app/api/auth/set-session/route.ts`, `lib/supabase/server.ts`, `lib/supabase/client.ts`
- Services/examples: `lib/services/product.ts`, `lib/services/order.ts`, `lib/services/profile.ts`
- Context: `context/AuthProvider.tsx` (shows how profile is refreshed and how supabase.onAuthStateChange is used)
- UI patterns: `components/ui/*` and `components/dashboard/*`

Edge cases and known pitfalls

- Do not attempt to set cookies from server components without following Next.js/NextResponse patterns — middleware contains comments showing how to copy cookies into a new response.
- Avoid global server Supabase clients — this codebase intentionally creates new server clients per request to be compatible with Fluid compute.

If you modify this file

- Keep it short and focused. Preserve the above concrete references and any critical comments copied from the codebase (e.g., cookie handling and client creation warnings).

Questions for the repo owner

- Are there CI commands or custom scripts (e.g., tests) not present in package.json that should be included here?
- Should we document preferred code style rules beyond the current ESLint config?

---

Please review and tell me if you'd like any additional sections (CI, PR checklist, or conventions for naming tests/endpoints). I can iterate.
