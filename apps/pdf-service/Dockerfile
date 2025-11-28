FROM mcr.microsoft.com/playwright:v1.50.0-jammy

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy workspace config
COPY pnpm-workspace.yaml package.json ./

# Copy shared package
COPY packages/shared ./packages/shared

# Copy pdf-service
COPY apps/pdf-service ./apps/pdf-service

# Install dependencies
RUN pnpm install

# Build shared package
RUN pnpm --filter @web-infra/shared build

# Build pdf-service
RUN pnpm --filter pdf-service build

# Expose port
EXPOSE 3001

# Start service
CMD ["pnpm", "--filter", "pdf-service", "start"]
