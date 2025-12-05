FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.base.json ./
COPY nx.json ./

# Copy shared libraries
COPY libs/ ./libs/

# Copy frontend app
COPY apps/admin-panel/ ./apps/admin-panel/

# Install dependencies
RUN npm ci

# Build frontend
RUN npx nx build admin-panel --prod

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy standalone build
COPY --from=builder /app/dist/apps/admin-panel/.next/standalone ./
COPY --from=builder /app/dist/apps/admin-panel/.next/static ./.next/static
COPY --from=builder /app/dist/apps/admin-panel/public ./public

EXPOSE 3001

ENV NODE_ENV=production
ENV PORT=3001

CMD ["node", "server.js"]