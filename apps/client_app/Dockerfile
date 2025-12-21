# FIX: Используем Node.js 20, так как Next.js 14/15+ требует версию >= 20.9.0
FROM node:20-alpine AS base
WORKDIR /app
RUN npm install -g turbo@^1.10.0

FROM base AS prune
COPY . .
RUN turbo prune --scope=client_app --docker

FROM base AS builder
COPY --from=prune /app/out/json/ .
COPY --from=prune /app/out/package-lock.json ./package-lock.json
RUN npm install

COPY --from=prune /app/out/full/ .
# FIX: Запуск turbo напрямую
RUN turbo run build --filter=client_app...

# FIX: Тут тоже используем 20 версию
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/client_app/public ./apps/client_app/public

COPY --from=builder --chown=nextjs:nodejs /app/apps/client_app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/client_app/.next/static ./apps/client_app/.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "apps/client_app/server.js"]