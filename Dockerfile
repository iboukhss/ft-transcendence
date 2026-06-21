# Stage 1
FROM node:24-alpine AS builder

WORKDIR /src

RUN apk add --no-cache libc6-compat

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

# Stage 2
FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

COPY --from=builder /src/.output ./.output
COPY --from=builder /src/package*.json ./
COPY --from=builder /src/drizzle.config.ts ./
COPY --from=builder /src/server/database/schema.ts ./server/database/schema.ts

COPY --from=builder /src/shared ./shared

COPY entrypoint.sh ./

RUN npm ci --omit=dev && npm install --save-prod drizzle-kit

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]
