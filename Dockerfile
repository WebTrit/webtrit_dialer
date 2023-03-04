# build stage
FROM node:lts-alpine3.15 AS build-stage

RUN apk add --no-cache \
    git \
    binutils-gold \
    g++ \
    gcc \
    gnupg \
    libgcc \
    linux-headers \
    make \
    python3

WORKDIR /app

ENV NODE_OPTIONS=--openssl-legacy-provider

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# production stage
FROM nginx:stable-alpine AS production-stage

LABEL maintainer="WebTrit Docker Maintainers <docker-maint@webtrit.com>"

COPY docker/etc/nginx/ /etc/nginx/
COPY docker/30-envsubst-on-app.sh /docker-entrypoint.d
COPY --from=build-stage /app/dist /usr/share/nginx/html

ENV VUE_APP_PUBLIC_PATH=""
