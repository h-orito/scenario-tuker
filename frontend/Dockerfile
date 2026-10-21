# 本番は arm64。マルチアーキの node:* より arm64v8/node:* のほうが先にセキュリティ修正版へ更新されるのでこちらを使う。Alpine 系は k3s で DNS 問題が出るので使わない
FROM arm64v8/node:22-bookworm-slim AS base
WORKDIR /app
RUN corepack enable

# 依存関係（ビルド用: devDependencies 込み）
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 依存関係（実行用: dependencies のみ）
FROM base AS prod-deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

# ビルド。NEXT_PUBLIC_* はビルド時に埋め込まれるのでこのステージだけで渡す
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY package.json pnpm-lock.yaml next.config.mjs tsconfig.json tailwind.config.ts postcss.config.mjs ./
COPY src src
COPY public public

ARG FIREBASE_API_KEY
ENV NEXT_PUBLIC_FIREBASE_API_KEY=${FIREBASE_API_KEY}
ARG FIREBASE_AUTH_DOMAIN
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${FIREBASE_AUTH_DOMAIN}
ARG FIREBASE_DATABASEURL
ENV NEXT_PUBLIC_FIREBASE_DATABASEURL=${FIREBASE_DATABASEURL}
ARG FIREBASE_PROJECTID
ENV NEXT_PUBLIC_FIREBASE_PROJECTID=${FIREBASE_PROJECTID}
ARG FIREBASE_STORAGEBUCKET
ENV NEXT_PUBLIC_FIREBASE_STORAGEBUCKET=${FIREBASE_STORAGEBUCKET}
ARG FIREBASE_MESSAGINGSENDERID
ENV NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID=${FIREBASE_MESSAGINGSENDERID}
ARG FIREBASE_APPID
ENV NEXT_PUBLIC_FIREBASE_APPID=${FIREBASE_APPID}
ARG ENV
ENV NEXT_PUBLIC_ENV=${ENV}
ARG API_BASE
ENV NEXT_PUBLIC_API_BASE=${API_BASE}

RUN pnpm build

# 実行。pnpm / corepack を通さず node で next を直接起動する（起動時のダウンロードやホームディレクトリへの書き込みをしない）
FROM arm64v8/node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/package.json /app/next.config.mjs ./
COPY --from=builder /app/public ./public
# .next/cache への書き込み（画像最適化など）があるので node ユーザーの所有にする
COPY --from=builder --chown=node:node /app/.next ./.next

USER node
EXPOSE 3000

CMD ["node", "node_modules/next/dist/bin/next", "start"]
