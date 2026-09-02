FROM node:22-alpine AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx ng build

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/box-app/browser /usr/share/nginx/html

RUN chown -R nginx:nginx /usr/share/nginx/html

USER nginx

# a non-root user cannot bind a port below 1024, which is why the app listens on 8080
EXPOSE 8080

# any wget failure becomes exit 1, the code docker reads as unhealthy
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1
