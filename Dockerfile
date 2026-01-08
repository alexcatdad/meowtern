# Build stage
FROM oven/bun:1 AS builder

# Base path for Vite build (/ for production, /meowtern/ for subpath deployments)
ARG VITE_BASE_PATH=/
ENV VITE_BASE_PATH=${VITE_BASE_PATH}

WORKDIR /app

# Copy package files
COPY package.json bun.lock ./
COPY packages/web-tui/package.json packages/web-tui/
COPY apps/demo/package.json apps/demo/

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the demo app (skip turbo, build demo directly)
RUN cd apps/demo && bun run vite build

# Production stage - serve static files
FROM nginx:alpine

# Copy built demo to nginx
COPY --from=builder /app/apps/demo/dist /usr/share/nginx/html

# Copy nginx config for SPA routing
RUN echo 'server { \
    listen 80; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
