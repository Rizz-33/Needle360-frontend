# Stage 1: Build the React app
FROM node:20-alpine as build
WORKDIR /app

# Build arguments
ARG VITE_API_URL
ARG VITE_STRIPE_PUBLISHABLE_KEY
ARG BUILD_VERSION

# Set environment variables
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_STRIPE_PUBLISHABLE_KEY=$VITE_STRIPE_PUBLISHABLE_KEY
ENV NODE_ENV=production

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies including Vite
RUN npm install --legacy-peer-deps
RUN npm install vite --save-dev

# Copy source code
COPY . .

# Build application
RUN npm run build

# Create version file
RUN echo "$BUILD_VERSION" > /app/dist/version.txt

# Stage 2: Production server
FROM nginx:alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Create SSL directory (matches volume mount path)
RUN mkdir -p /etc/ssl/needle360

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built app
COPY --from=build /app/dist /usr/share/nginx/html

# Set permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost/version || exit 1

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]