# Transcendence

## Build dependencies
- Node.js v24+
- npm
- Docker and Docker Compose

## Stack
- **Framework:** Nuxt 4 (full-stack)
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Form validation:** Zod
- **Styling:** Nuxt UI with Tailwind CSS
- **Auth:** [nuxt-auth-utils](https://nuxt.com/modules/auth-utils)

## Development dependencies
- drizzle-kit
- @nuxt/eslint
- eslint-plugin-perfectionist
- eslint-plugin-tailwindcss
- bruno
- mkcert

## Initial dev setup

```bash
# 1. Copy the environment file
cp .env.example .env

# 2. Generate HTTPS keys (important!)
sudo apt install mkcert
mkcert -install
mkcert localhost

# 3. Install the project dependencies
npm install

# 4. Start the database container
docker compose up -d

# 5. Apply SQL migrations
npm run db:migrate

# 6. Start the server
npm run dev
```

Eventually, the goal will be to deploy everything with a single command but I think it's best to start simple before getting into any premature refactoring.

## Available dev commands

```bash
# Start dev server (main command)
npm run dev

# Check code style
npm run lint
npm run lint:fix

# Database operations (Drizzle)
npm run db:push
npm run db:generate
npm run db:migrate
npm run db:studio
npm run db:seed

# Other
npm run typecheck
```
