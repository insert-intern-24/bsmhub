# Build Stage
FROM node:23-alpine AS builder
WORKDIR /app
RUN apk add --no-cache vips-dev
COPY package*.json ./
RUN npm ci
RUN npm install --platform=linuxmusl --arch=x64 sharp
COPY . .
RUN echo 'import type { NextConfig } from "next"; const nextConfig: NextConfig = {typescript: {ignoreBuildErrors: true,},eslint: {ignoreDuringBuilds: true,},output: "standalone",images: { domains: ["lh3.googleusercontent.com"] },}};export default nextConfig;' > ./next.config.ts
RUN npm run build

# Production Stage
FROM node:23-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Sharp 패키지를 위한 시스템 라이브러리 설치
RUN apk add --no-cache vips-dev

# 프로덕션에 필요한 파일만 복사
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Sharp 설치 및 프로덕션 의존성 설치
# RUN npm install --platform=linuxmusl --arch=x64 sharp

# 포트 설정 및 실행
ENV PORT=3000
EXPOSE 3000
CMD ["node", "server.js"]
