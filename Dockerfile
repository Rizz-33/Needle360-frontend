
# Stage 1: Build the React app
FROM node:18-alpine as build
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build arguments - these must be declared before use
ARG VITE_API_URL
ARG VITE_STRIPE_PUBLISHABLE_KEY

# Set environment variables for build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_STRIPE_PUBLISHABLE_KEY=$VITE_STRIPE_PUBLISHABLE_KEY

# Debug: Print environment variables (mask sensitive data)
RUN echo "=== BUILD ENVIRONMENT DEBUG ==="
RUN echo "VITE_API_URL: $VITE_API_URL"
RUN echo "VITE_STRIPE_PUBLISHABLE_KEY: ${VITE_STRIPE_PUBLISHABLE_KEY:0:20}..."
RUN echo "NODE_ENV: $NODE_ENV"

# Verify .env file if it exists
RUN if [ -f .env ]; then echo "=== .env file contents ==="; cat .env; else echo "No .env file found"; fi

# Build the application
RUN npm run build

# Debug: Check build output
RUN echo "=== BUILD OUTPUT DEBUG ==="
RUN ls -la dist/
RUN ls -la dist/assets/ | head -10

# Stage 2: Production server
FROM nginx:alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Create SSL directories
RUN mkdir -p /etc/ssl/needle360 /etc/ssl/private

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application
COPY --from=build /app/dist /usr/share/nginx/html

# Set proper permissions
RUN chmod -R 755 /usr/share/nginx/html

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80/ || exit 1

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
