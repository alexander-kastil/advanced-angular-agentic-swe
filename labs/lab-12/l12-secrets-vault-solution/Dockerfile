FROM node:22-alpine AS build
WORKDIR /src
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS final
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /src/dist/l12-secrets-vault ./dist/l12-secrets-vault
# The server bundle carries its own dependencies, so no second npm install is needed.
COPY --from=build /src/package.json ./package.json
ENV PORT=4000
EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 --start-period=15s \
    CMD wget -qO- http://127.0.0.1:4000/login > /dev/null || exit 1
CMD ["node", "dist/l12-secrets-vault/server/server.mjs"]
