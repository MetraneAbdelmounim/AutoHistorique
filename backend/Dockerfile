# ─── Build stage ────────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

# Install deps (cached layer when package*.json unchanged)
COPY package*.json ./
RUN npm ci --omit=dev

# ─── Runtime stage ──────────────────────────────────────────
FROM node:20-alpine
WORKDIR /app

# Non-root user for security
RUN addgroup -S app && adduser -S app -G app

# Copy production dependencies
COPY --from=build /app/node_modules ./node_modules
COPY --chown=app:app package*.json ./
COPY --chown=app:app src ./src

ENV NODE_ENV=production
ENV PORT=3000

# Healthcheck hits /api/health every 30s
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

USER app
EXPOSE 3000
CMD ["node", "src/server.js"]
