# Transcendence

## Stack
- **Framework:** Nuxt 4 (full-stack)
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Form validation:** Zod
- **Styling:** Nuxt UI with Tailwind CSS
- **Auth:** [nuxt-auth-utils](https://nuxt.com/modules/auth-utils)

## Build dependencies
- Node.js v24+
- npm
- Docker and Docker Compose

## Development dependencies
- drizzle-kit
- drizzle-seed
- @nuxt/eslint
- eslint-plugin-perfectionist
- eslint-plugin-tailwindcss
- @faker-js/faker
- mkcert
- bruno
- curl

## Initial dev setup

```bash
# 1. Copy the environment file
cp .env.example .env

# 2. Generate HTTPS keys (important!)

# with root access
sudo apt install mkcert
mkcert -install
mkcert localhost

# otherwise, at 42 to install mkcert without root privileges (make sure ~/.local/bin is in your PATH)
mkdir -p ~/.local/bin
wget -O ~/.local/bin/mkcert https://github.com/FiloSottile/mkcert/releases/download/v1.4.4/mkcert-v1.4.4-linux-amd64
mkcert -CAROOT
mkcert localhost

# 3. Install the project dependencies
npm install

# 4. Start the database container
docker compose up -d

# 5. Push the database schema
npm run db:push

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
npm run db:reset
npm run db:seed

# Other
npm run typecheck

# How to nuke the database in case something goes wrong
docker compose down -v
docker compose up -d
npm run db:push

# Or use this more gentle method to scrub all database tables
npm run db:reset
```
