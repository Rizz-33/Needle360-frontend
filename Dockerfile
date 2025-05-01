# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Install dependencies first with more verbose output
COPY package*.json ./
RUN npm --version && \
    echo "Installing dependencies..." && \
    npm install --no-fund --no-audit --loglevel verbose

# Copy application code
COPY . .

# Build the application
RUN echo "Building application..." && \
    npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Create default nginx config if not present
RUN echo 'server { \
    listen 80; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]