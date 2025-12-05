FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.base.json ./
COPY nx.json ./

# Copy shared libraries
COPY libs/ ./libs/

# Copy backend app
COPY apps/admin-backend/ ./apps/admin-backend/

# Install dependencies
RUN npm ci

# Build backend and shared libraries
RUN npx nx build admin-backend --prod

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built files - Nx tsc outputs to dist/apps/admin-backend/src
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production

# Start app from the correct path
CMD ["node", "dist/apps/admin-backend/src/main.js"]