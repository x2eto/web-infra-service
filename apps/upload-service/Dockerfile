FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy workspace config
COPY pnpm-workspace.yaml package.json ./

# Copy shared package
COPY packages/shared ./packages/shared

# Copy upload-service
COPY apps/upload-service ./apps/upload-service

# Install dependencies
RUN pnpm install

# Build shared package
RUN pnpm --filter @web-infra/shared build

# Build upload-service
RUN pnpm --filter upload-service build

# Expose port
EXPOSE 3002

# Start service
CMD ["pnpm", "--filter", "upload-service", "start"]
