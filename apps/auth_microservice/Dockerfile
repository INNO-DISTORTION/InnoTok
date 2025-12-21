FROM node:18-alpine AS base
WORKDIR /app
RUN npm install -g turbo

FROM base AS prune
COPY . .
RUN turbo prune --scope=@innogram/auth --docker

FROM base AS builder
COPY --from=prune /app/out/json/ .
COPY --from=prune /app/out/package-lock.json ./package-lock.json
RUN npm install

COPY --from=prune /app/out/full/ .
RUN npm run build --filter=@innogram/auth...

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/auth_microservice/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/auth_microservice/package.json ./package.json

EXPOSE 3002
CMD ["node", "dist/index.js"]