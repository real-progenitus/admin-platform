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

# Build argument for API URL
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Build frontend
RUN npx nx build admin-panel --prod

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy the Next.js build from source (Nx doesn't move .next to dist)
COPY --from=builder /app/apps/admin-panel/.next ./.next
COPY --from=builder /app/apps/admin-panel/public ./public
COPY --from=builder /app/apps/admin-panel/next.config.js ./
COPY --from=builder /app/apps/admin-panel/package.json ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3001

ENV NODE_ENV=production
ENV PORT=3001
ENV HOSTNAME=0.0.0.0

CMD ["dumb-init", "node_modules/.bin/next", "start", "-p", "3001"]