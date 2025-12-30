# Sharing Is Caring

**Repository:** https://github.com/willem4130/sharing-is-caring

Event accommodation sharing platform - find compatible roommates for festivals, conferences, concerts, and any event worldwide.

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (public)/                # Public routes
│   │   ├── page.tsx             # Landing page
│   │   └── login/               # Login page
│   ├── (onboarding)/            # Profile setup wizard
│   │   ├── welcome/
│   │   ├── profile/
│   │   ├── photos/
│   │   ├── preferences/
│   │   ├── dealbreakers/
│   │   └── complete/
│   ├── (app)/                   # Authenticated routes
│   │   ├── home/                # Dashboard
│   │   ├── events/              # Event discovery
│   │   ├── matches/             # Match discovery
│   │   ├── messages/            # Messaging
│   │   ├── accommodations/      # Accommodation management
│   │   └── profile/             # User profile
│   ├── api/                     # API routes
│   │   ├── auth/[...nextauth]/  # NextAuth handlers
│   │   └── trpc/[trpc]/         # tRPC endpoint
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
│
├── components/
│   ├── ui/                      # shadcn/ui primitives
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── forms/                   # Form components
│   │   ├── profile-form.tsx
│   │   └── preferences-form.tsx
│   ├── navigation/              # Navigation components
│   │   ├── bottom-nav.tsx
│   │   └── header.tsx
│   ├── events/                  # Event-related components
│   │   ├── event-card.tsx
│   │   └── event-list.tsx
│   ├── matches/                 # Match-related components
│   │   ├── match-card.tsx
│   │   └── compatibility-chart.tsx
│   └── shared/                  # Shared/common components
│       ├── avatar-stack.tsx
│       └── loading-spinner.tsx
│
├── lib/
│   ├── matching/                # Matching algorithm
│   │   ├── algorithm.ts         # Core algorithm
│   │   ├── weights.ts           # Scoring weights
│   │   └── dealbreakers.ts      # Dealbreaker logic
│   ├── utils/                   # Utility functions
│   │   ├── cn.ts                # Class name merger
│   │   ├── date.ts              # Date utilities
│   │   └── format.ts            # Formatting utilities
│   └── constants/               # App constants
│       ├── interests.ts         # Interest options
│       └── languages.ts         # Language options
│
├── server/
│   ├── api/
│   │   ├── routers/             # tRPC routers (one per domain)
│   │   │   ├── auth.ts          # Authentication
│   │   │   ├── users.ts         # User profiles
│   │   │   ├── events.ts        # Events
│   │   │   ├── matches.ts       # Matching
│   │   │   ├── messages.ts      # Messaging
│   │   │   ├── accommodations.ts # Accommodations
│   │   │   └── reviews.ts       # Reviews
│   │   ├── root.ts              # Router aggregation
│   │   └── trpc.ts              # tRPC config & middleware
│   ├── services/                # Business logic services
│   │   ├── matching-service.ts  # Matching logic
│   │   ├── notification-service.ts
│   │   └── verification-service.ts
│   ├── auth.ts                  # NextAuth config
│   └── db/
│       └── index.ts             # Prisma client
│
├── hooks/                       # Custom React hooks
│   ├── use-user.ts
│   ├── use-events.ts
│   └── use-matches.ts
│
├── types/                       # TypeScript types
│   ├── api.ts                   # API response types
│   └── forms.ts                 # Form types
│
└── trpc/                        # tRPC client
    └── react.tsx                # React Query integration

prisma/
├── schema.prisma                # Database schema
├── seed.ts                      # Seed data
└── migrations/                  # Migration files

.claude/
└── commands/                    # Claude Code commands
    ├── fix.md                   # /fix command
    └── commit.md                # /commit command
```

## Organization Rules

**Directory separation:**
- `components/` → UI components grouped by feature
- `lib/` → Pure functions, utilities, constants
- `server/` → Backend code (API, services, DB)
- `hooks/` → Custom React hooks
- `types/` → TypeScript type definitions

**Component organization:**
- UI primitives → `components/ui/` (shadcn)
- Feature components → `components/{feature}/`
- Shared components → `components/shared/`

**Server organization:**
- API routers → `server/api/routers/` (one per domain)
- Business logic → `server/services/`
- Database → `server/db/`

**Modularity principles:**
- Single responsibility per file
- Feature-based grouping
- Clear, descriptive file names
- Co-locate related code

## Code Quality - Zero Tolerance

After editing ANY file, run:

```bash
npm run lint && npm run typecheck
```

Fix ALL errors before continuing.

## Key Commands

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm run lint         # ESLint
npm run typecheck    # TypeScript check
npm run db:push      # Push schema to DB
npm run db:migrate   # Run migrations
npm run db:studio    # Prisma Studio
npm run db:seed      # Seed database
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 + App Router + Turbopack |
| API | tRPC (type-safe) |
| Database | PostgreSQL + Prisma |
| Auth | NextAuth v5 (Google, Apple) |
| UI | shadcn/ui + Tailwind CSS |
| Charts | Apache ECharts |
| Animations | Framer Motion |
| Validation | Zod |
| State | TanStack React Query |

## Matching Algorithm

Located in `/src/lib/matching/`. Scores users 0-100:

| Factor | Points |
|--------|--------|
| Sleep schedule | 20 |
| Budget overlap | 15 |
| Cleanliness | 15 |
| Smoking tolerance | 12 |
| Drinking tolerance | 10 |
| Social level | 10 |
| Shared interests | 8 |
| Languages | 5 |
| Verification | 3 |
| Gender preference | 2 |

## Git Workflow

**CRITICAL: This is a SEPARATE repository. NEVER commit to any nextjs-* or template repos!**

```bash
# Initialize NEW repo (this project only)
cd /Users/willemvandenberg/Dev/sharing-is-caring
git init
gh repo create sharing-is-caring --public --source=. --remote=origin

# First commit
git add .
git commit -m "Initial commit: Sharing Is Caring platform"
git push -u origin main
```

**WARNING:**
- This repo: `github.com/willem4130/sharing-is-caring`
- DO NOT push to any template, nextjs-fullstack-template, or other repos
- Always verify you're in the correct directory before git operations
