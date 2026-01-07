# Build stage
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lock ./
COPY packages/lib/package.json packages/lib/
COPY packages/demo/package.json packages/demo/

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the demo app
RUN bun run build

# Production stage - serve static files
FROM nginx:alpine

# Copy built demo to nginx
COPY --from=builder /app/packages/demo/dist /usr/share/nginx/html

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
