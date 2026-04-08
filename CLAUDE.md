# EduPath — CLAUDE.md

## Project
Study abroad CRM for a single consultant managing 8–50 active students through visa approval.

## Tech Stack
- React 19 + TypeScript (strict) + Vite 8
- Tailwind CSS v4 + shadcn/ui
- Zustand (UI state) + TanStack Query (server state)
- Supabase (Postgres + Auth + Realtime)
- React Router v7
- react-hook-form + zod (forms)
- date-fns (all date manipulation — never raw `new Date()` arithmetic)
- Vitest + React Testing Library

## Commands
```bash
npm run dev          # Dev server (port 5173)
npm run build        # Production build
npm run test         # Vitest run
npm run test:watch   # Vitest watch
npm run test:ui      # Vitest UI
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
```

## Directory Structure
```
src/
  components/       # Shared UI (Button, Badge, Modal, etc.)
  features/
    dashboard/
    students/
    pipeline/
    visas/
    consultations/
  hooks/            # Shared hooks (useStudents, useVisaAlerts, etc.)
  lib/
    api/            # All Supabase queries live here — never inline in components
    supabase.ts     # Supabase client singleton
    utils.ts        # daysUntil, formatDate, getVisaStatus, getInitials, etc.
  types/            # TypeScript interfaces (Student, Visa, Consultation, etc.)
  test/             # setup.ts (jest-dom)
supabase/
  migrations/
  seed.sql
```

## Code Standards
- TypeScript strict — no `any`, no untyped returns
- Functional components with typed props interfaces
- No nested ternaries in JSX — extract to variables or helpers
- All Supabase queries in `src/lib/api/` only
- Dates: always use `date-fns`, never raw `new Date()` arithmetic
- Test files co-located: `Foo.test.tsx` next to `Foo.tsx`
- Path alias: `@/` maps to `src/`

## Business Rules
- Visa expiry alerts fire at ≤30 days remaining
- Each student can have multiple consultations and visas (history preserved)
- Emergency contact required before status can advance past "Applied"
- Dates: ISO 8601 internally (YYYY-MM-DD), display as DD MMM YYYY

## Pipeline Stages (ordered)
1. Consulting → 2. Documents Preparing → 3. Applied → 4. Awaiting Decision
→ 5. Offer Received → 6. Enrolled → 7. Visa Lodged → 8. Visa Approved → 9. Departed

## Warnings
- Never nest template literals (backtick inside `${}`) — use string concatenation
- Keep all Supabase keys in `.env.local` — never commit them
- Visa expiry calculation must account for timezone (use UTC midnight comparison)
- RLS must be enabled on all Supabase tables before production
