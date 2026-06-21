*This project has been created as part of the 42 curriculum by dheck, iboukhss, aakerblo, knjaloun, jmeli.*

# LuxLink

## Description

**LuxLink** is a freelance services marketplace connecting clients ("Companies") with independent professionals ("Freelancers") across the Greater Region (Luxembourg, France, Belgium, Germany).

The platform allows companies to post job offers, freelancers to apply with a motivation letter and proposed rate, and both parties to go through a two-step handshake (company approval → freelancer confirmation) before a contract is automatically created. The project covers the full lifecycle of a freelance engagement: discovery, application, negotiation, booking, and account/data management — including a complete GDPR compliance suite.

### Key features

- Freelancer and Company account types with dedicated dashboards
- Job posting, browsing, filtering (skills, location, salary, category, workplace) and search
- A two-step offer handshake system (company accepts → freelancer confirms → booking created automatically)
- Real-time online/offline presence indicators via WebSockets
- Google OAuth login alongside standard email/password authentication
- Role-based access control (Freelancer / Company / Admin) enforced via global middleware
- A full admin panel to search, view, edit, and delete user accounts (with multi-step deletion guardrails)
- GDPR compliance: data export (JSON), account deletion, and a rights-request contact form
- A public, API-key-authenticated REST API with rate limiting, separate from the session-based web app
- Avatar upload/replace/delete, with file type and size validation
- A custom design system built on Nuxt UI with reusable components (cards, filters, edit sections)

---

## Team Information

| Login | Role(s) | Responsibilities |
|---|---|---|
| **dheck** | Architect / Technical Lead | WebSockets, API routes, full stack, database setup |
| **iboukhss** | Project Owner | API endpoints, full stack, organization |
| **aakerblo** | Developer | Frontend, testing, debugging |
| **knjaloun** | Developer | OAuth, testing, debugging |
| **jmeli** | Project Manager | Organization, testing |

---

## Project Management

- **Work organization:** the team met regularly in person at 42 to plan, divide, and review work.
- **Tools:** GitHub for version control, issue tracking, and pull request review.
- **Communication:** Discord (day-to-day coordination) and WhatsApp (quick syncs).

---

## Technical Stack

### Frontend
- **Nuxt 4** (Vue 3) — full-stack framework, used here primarily for SSR pages and the client app
- **Nuxt UI** — component library (built on Tailwind CSS and Reka UI) for the design system
- **Tailwind CSS** — utility-first styling

### Backend
- **Nuxt 4 / Nitro** — the same framework powers the server API (`server/api/`), keeping frontend and backend in a single codebase and deployment unit
- **nuxt-auth-utils** — session-based authentication and OAuth integration
- **WebSockets (via Nitro/crossws)** — real-time presence system

### Database
- **PostgreSQL** — relational database
- **Drizzle ORM** — type-safe schema definition and queries

### Validation & tooling
- **Zod** — shared frontend/backend schema validation
- **drizzle-seed** / **@faker-js/faker** — database seeding for development
- **Bruno** — manual API test collections (`testing/bruno/`)
- **ESLint** (with `eslint-plugin-perfectionist`, `eslint-plugin-tailwindcss`) — code style enforcement

### Why these choices

**PostgreSQL**
- Mature, ACID-compliant relational database — a good fit for a domain with many interrelated entities (users, profiles, jobs, offers, bookings) and strict referential integrity needs (foreign keys, cascading deletes for GDPR compliance).
- Native support for enums and array columns, both used extensively in our schema (e.g. `skills`, `languages` as arrays; status fields as enums).
- Free, open-source, and runs identically in development (Docker) and production.

**Nuxt.js / Vue**
- A single framework covers both frontend (SSR pages, routing, components) and backend (file-based API routes in `server/api/`), reducing context-switching and duplicated tooling.
- Vue's component model and Nuxt's auto-imports kept the codebase concise across 5 contributors working in parallel on different features.
- Built-in SSR support (a project requirement) with no extra configuration.
- Strong ecosystem: `nuxt-auth-utils` for auth/OAuth, Nuxt UI for the design system, and first-class TypeScript support throughout.

**Drizzle ORM**
- Type-safe queries generated directly from the schema definition — query bugs are caught at compile time rather than at runtime.
- SQL-like query builder (rather than a heavier abstraction) made it easy for the team to reason about exactly what queries were being run, which mattered for debugging foreign-key/cascade issues during development.
- Lightweight compared to alternatives like Prisma, with fast cold-start times suited to a Nitro serverless-style runtime.
- `drizzle-kit` provides both quick iteration (`db:push`) for early development and proper versioned migrations (`db:generate` / `db:migrate`) for later stages.

---

## Database Schema

The schema is defined in `server/database/schema.ts`. Core tables and relationships:

```
users (1) ───< (1) freelancer_profiles
      │
      └──── (1) company_profiles

users (1) ───< (many) jobs            [company posts jobs]
jobs  (1) ───< (many) offers          [freelancers apply to jobs]
users (1) ───< (many) offers          [as buyer (company) or seller (freelancer)]
offers(1) ───< (1) bookings           [created once an offer is mutually accepted]
users (1) ───< (many) api_keys        [for the public v1 API]
```

| Table | Purpose | Key fields |
|---|---|---|
| `users` | Core identity, credentials, role | `email`, `password` (hashed), `accountType`, `role` |
| `freelancer_profiles` | Public freelancer profile | `firstName`, `lastName`, `country`, `skills[]`, `languages[]`, `hourlyRate` |
| `company_profiles` | Public company profile | `companyName`, `contactFirstName/LastName`, `description`, `website` |
| `jobs` | Job postings | `title`, `category`, `skills[]`, `hourlyRate`, `duration`, `workplace`, `status` |
| `offers` | Applications / negotiation state | `jobId`, `buyerId`, `sellerId`, `status`, `motivationLetter`, `proposedHourlyRate` |
| `bookings` | Confirmed contracts | `offerId`, `jobId`, `price`, `hourlyRate`, `duration`, `status` |
| `api_keys` | Public API authentication | `userId`, `key`, `isActive`, `expiresAt` |

All foreign keys to `users` use `onDelete: 'cascade'` so that account deletion (a GDPR requirement) cleanly removes all associated data.

---

## Features List

> Attribution below is a first draft based on commit history and file ownership patterns. **To be reviewed and corrected by the team.**

| Feature | Built by | Description |
|---|---|---|
| Database schema & migrations | <name> | Core schema design, enums, relations |
| Authentication (email/password) | <name> | Register, login, session management |
| Google OAuth | <name> | Remote authentication via `nuxt-auth-utils` |
| Job posting & management | <name> | Create, edit, delete jobs (company side) |
| Job browsing & filters | <name> | Search, skills/location/salary/category/workplace filters |
| Public profile browsing | <name> | Freelancer directory with filters |
| Offer / application system | <name> | Submit, edit, withdraw applications |
| Two-step handshake & booking | <name> | Company/freelancer mutual acceptance, automatic booking creation |
| Admin panel | <name> | User search, edit, multi-guardrail deletion |
| Avatar upload/delete | <name> | File validation, storage, replacement |
| WebSocket presence system | <name> | Real-time online/offline indicators |
| Public API (v1) | <name> | API-key auth, rate limiting |
| GDPR data export & deletion | <name> | JSON export, account deletion, rights request form |
| Privacy Policy / Terms of Service | <name> | Luxembourg-law-compliant legal pages |
| Settings (account, security, preferences) | <name> | Email/password change, theme selection |
| Testing & QA | <name> | Manual test plans, Bruno collections |

---

## Modules

> Reviewed against the current codebase. Corrections from the original list are noted with **[checked]**.

### Web — 11/14 pts (revised from 9/14)

| Status | Goal | Score |
|---|---|---|
| ✅ | Use a framework for both frontend and backend | 2 pts |
| ✅ | Implement real-time features using WebSockets | 2 pts | **[checked: presence system is implemented and functional]**
| ✅ | Allow users to interact with each other | 2 pts | **[checked: the offer/handshake system is a real two-party interaction]**
| ✅ | Implement a public API | 2 pts |
| ✅ | Use an ORM for the database | 1 pt |
| ✅ | Implement a complete notification system | 1 pt | (toast-based, covers CRUD feedback)
| ✅ | Server-Side Rendering | 1 pt |
| ❌ | Progressive Web App (PWA) | 1 pt |
| ✅ | Custom-made design system with reusable components | 1 pt |
| ❔ | Advanced search with filters, sorting, pagination | 1 pt | (filters done; server-side pagination recently added to `/api/jobs` — close to claimable)
| ✅ | File upload and management system | 1 pt |

**Remaining gaps:**
- API key **creation** endpoint still missing (only update exists) — needed to fully claim the public API points with confidence
- Uploaded file deletion: **done** for avatars; not yet available for other upload types if any exist
- Pagination/sorting on the search module needs final verification before claiming the point

### Accessibility and Internationalization — 1/5 pts

| Status | Goal | Score |
|---|---|---|
| ❌ | WCAG 2.1 AA compliance | 2 pts |
| ❌ | Multi-language support (3+) | 1 pt |
| ❌ | RTL support | 1 pt |
| ✅ | Support for 2+ additional browsers | 1 pt |

### User Management — 8/10 pts (revised from 5/10)

| Status | Goal | Score |
|---|---|---|
| ✅ | Standard user management and authentication | 2 pts |
| ✅ | Remote authentication with OAuth 2.0 | 1 pt | **[checked: Google OAuth implemented]**
| ✅ | Advanced permission system | 2 pts | (Freelancer / Company / Admin, global route middleware)
| ❔ | An organization system | 2 pts |
| ❌ | Complete 2FA system | 1 pt |
| ❔ | User activity analytics dashboard | 1 pt |

**Corrections from original list:** avatar upload, real-time online status, and Google OAuth were listed as "missing features" but are all implemented and confirmed working — moved from missing to ✅ above.

### Artificial Intelligence — 0/12 pts
Not planned.

### Cybersecurity — 0/2 pts
Not planned — WAF/ModSecurity + HashiCorp Vault deemed too costly relative to value for the project timeline.

### DevOps — 0/7 pts
Not planned.

### Data and Analytics — 2/4 pts (revised from 1/4)

| Status | Goal | Score |
|---|---|---|
| ❌ | Advanced analytics dashboard | 2 pts |
| ✅ | Data export and import functionality | 1 pt | **[checked: full JSON export of account, profile, bookings, offers/jobs/contracts]**
| ✅ | GDPR compliance features | 1 pt |

---

### Estimated total: 22/14 pts minimum required

*(Web 11 + Accessibility 1 + User Mgmt 8 + Data 2 = 22 — well above the 14pt threshold even before resolving the remaining ❔ items.)*

---

## AI Usage

Claude (Anthropic) was used throughout the project's lifecycle as a pair-programming and documentation assistant. Specific uses included:

- **Debugging:** diagnosing server crashes (e.g. an unhandled WebSocket promise rejection that crashed the Nitro process), database foreign-key constraint violations, schema/migration mismatches, and Vue hydration warnings.
- **Documentation:** drafting and updating `API_DOC.md` (kept in sync across ~9 major revisions as the API was restructured) to reflect the current state of the codebase.
- **Legal content:** drafting the Privacy Policy and Terms of Service pages with reference to Luxembourg and EU law (GDPR, e-commerce law).
- **This README:** drafted by Claude based on team-provided information (roles, module status, technical stack) and the project's actual implemented features as established through the development conversation; reviewed and corrected by the team before submission.

All AI-assisted code and content was reviewed, tested, and adjusted by team members before being merged.

---

## Individual Contributions

> To be completed by the team — see Features List above for a first-draft mapping of features to contributors.

---

## Instructions

### Build dependencies
- Node.js v24.14 (LTS recommended)
- npm
- Docker and Docker Compose

### Development dependencies
- drizzle-kit
- drizzle-seed
- @nuxt/eslint
- eslint-plugin-perfectionist
- eslint-plugin-tailwindcss
- @faker-js/faker
- mkcert
- bruno
- curl

### Initial dev setup

```bash
# 1. Copy the environment file and fill in the required values
cp .env.example .env

# 2. Generate HTTPS keys (required for local dev)
# with root access:
sudo apt install mkcert
mkcert -install
mkcert localhost

# without root access (e.g. at 42 — ensure ~/.local/bin is in your PATH):
mkdir -p ~/.local/bin
wget -O ~/.local/bin/mkcert https://github.com/FiloSottile/mkcert/releases/download/v1.4.4/mkcert-v1.4.4-linux-amd64
mkcert -install
mkcert localhost

# 3. Install dependencies
npm install

# 4. Start the database container
docker compose up -d

# 5. Push the database schema
npm run db:push

# 6. (Optional) Seed the database with sample data
npm run db:seed

# 7. Start the dev server
npm run dev
```

The app will be available at `https://localhost:3000`.

### Available dev commands

```bash
# Start dev server
npm run dev

# Code style
npm run lint
npm run lint:fix

# Database (Drizzle)
npm run db:push
npm run db:generate
npm run db:migrate
npm run db:studio
npm run db:reset
npm run db:seed

# Type checking
npm run typecheck

# Reset the database if something goes wrong
docker compose down -v
docker compose up -d
npm run db:push

# Or use the gentler reset task
npm run db:reset
```

### API Testing

Manual API test collections are available via [Bruno](https://www.usebruno.com/) in `testing/bruno/`. A curl-based smoke test script is also available for quick access-control and validation checks (see project test documentation).

---

## Resources

### PostgreSQL
- [Official documentation](https://www.postgresql.org/docs/)
- [PostgreSQL tutorial](https://www.postgresqltutorial.com/)

### Nuxt.js / Vue
- [Nuxt documentation](https://nuxt.com/docs)
- [Vue.js documentation](https://vuejs.org/guide/introduction.html)
- [Nuxt UI documentation](https://ui.nuxt.com/)
- [nuxt-auth-utils](https://nuxt.com/modules/auth-utils)

### Drizzle ORM
- [Drizzle ORM documentation](https://orm.drizzle.team/docs/overview)
- [Drizzle Kit (migrations) guide](https://orm.drizzle.team/docs/kit-overview)

---

## License & Credits

This project was created as part of the 42 Luxembourg curriculum (ft_transcendence subject) by dheck, iboukhss, aakerblo, knjaloun, jmeli.
