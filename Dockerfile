# Stage 1: Build the application with Bun
FROM oven/bun:1 AS builder
WORKDIR /workspace

# Copy package files and install dependencies
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

# Copy the entire application and build using Vite
COPY . .
RUN bun run build

# Stage 2: Serve the application using Nginx
FROM nginx:1.27-alpine AS production
ENV NODE_ENV=production

# Copy built Vite assets (typically in /dist)
COPY --from=builder /workspace/dist /usr/share/nginx/html

# Copy environment variable injection script (if needed)
COPY nginx/env-config.sh /docker-entrypoint.d/
RUN chmod +x /docker-entrypoint.d/env-config.sh

# Add the Nginx configuration
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]