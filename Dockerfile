# ---- 1. 빌더 스테이지 ----
FROM node:20-slim AS builder
WORKDIR /usr/src/app

# npm을 최신 버전으로 업데이트합니다.
RUN npm install -g npm@11.6.1

# 빌드에 필요한 모든 의존성 설치
COPY package*.json ./
RUN npm ci

# 소스코드 복사 및 빌드
COPY . .
RUN npm run build


# ---- 2. 러너 스테이지 ----
FROM node:20-slim
WORKDIR /usr/src/app

# npm을 최신 버전으로 업데이트합니다.
RUN npm install -g npm@11.6.1

# 빌더 스테이지에서 필요한 파일만 복사
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/dist ./dist

# 프로덕션 의존성만 설치
RUN npm ci --only=production

# 포트 노출 및 앱 실행
EXPOSE 8080
CMD [ "npm", "start" ]
