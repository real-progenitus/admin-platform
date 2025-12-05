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

# Copy built files
COPY --from=builder /app/dist/apps/admin-backend ./
COPY --from=builder /app/node_modules ./node_modules

# Expose port
EXPOSE 3000

# Start app
CMD ["node", "main.js"]