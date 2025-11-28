# Base image with all Playwright deps
############################
# Builder: compile TypeScript and prepare prod deps
############################
FROM node:20-bookworm-slim AS builder
# 设置工作目录
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# 仅复制 package.json 和 pnpm-lock.yaml 来利用 Docker 的层缓存
# 只有当这些文件变化时，pnpm install 才会重新运行
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate \
  && pnpm install --frozen-lockfile

COPY tsconfig.json ./
COPY src ./src
# 运行 TypeScript 编译
RUN pnpm build

# Prune dev dependencies to production-only
RUN pnpm prune --prod

# 使用微软官方的 Playwright 镜像作为最终的运行环境
# 这个镜像已经包含了所有浏览器和所需的操作系统依赖
FROM mcr.microsoft.com/playwright:v1.55.0-jammy AS runner
# 设置工作目录
WORKDIR /app

# Copy production node_modules and dist only
COPY --from=builder /app/node_modules ./node_modules
# 复制 package.json 以便 Node.js 可以找到主入口文件等信息
COPY --from=builder /app/package.json ./package.json
# 从 builder 阶段复制构建好的 JavaScript 文件
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 3000

# 定义容器启动时运行的命令
# 直接使用 node 运行编译后的 JS 文件
CMD ["node", "dist/index.js"]


