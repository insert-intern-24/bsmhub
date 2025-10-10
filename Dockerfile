# Build Stage
FROM node:23-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
RUN apk add --no-cache vips-dev git
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
# RUN npm_config_platform=linuxmusl npm_config_arch=x64 pnpm add sharp
COPY . .
RUN pnpm run build

# Production Stage
FROM node:23-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# 프로덕션에 필요한 파일만 복사
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# 포트 설정 및 실행
ENV PORT=3000
EXPOSE 3000
CMD ["node", "server.js"]
