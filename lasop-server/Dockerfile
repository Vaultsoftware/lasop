# syntax = docker/dockerfile:1

ARG NODE_VERSION=20-slim
FROM node:${NODE_VERSION} AS base

LABEL fly_launch_runtime="Node.js"

WORKDIR /app
ENV NODE_ENV=production

# --- Build stage ---
FROM base AS build
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3 && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --omit=dev

# Copy all app source files (including uploads)
COPY . .

# ✅ Ensure uploads directory exists and stays bundled
RUN mkdir -p /app/public/uploads/blog

# --- Final stage ---
FROM base
COPY --from=build /app /app

# ✅ Make sure uploads folder is kept
RUN mkdir -p /app/public/uploads/blog

# Fly.io port
ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]
