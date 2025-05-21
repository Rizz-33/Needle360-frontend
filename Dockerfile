# Stage 1: Build the React app
FROM node:18-alpine as build
WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the files
COPY . .

# Debug .env file and directory
RUN echo "Current directory: $(pwd)"
RUN ls -la
RUN if [ -f .env ]; then echo ".env file found"; cat .env; else echo "No .env file found"; exit 1; fi

# Set build arguments and environment variables
ARG VITE_API_URL
ARG VITE_STRIPE_PUBLISHABLE_KEY
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_STRIPE_PUBLISHABLE_KEY=$VITE_STRIPE_PUBLISHABLE_KEY

# Debug environment variables
RUN echo "Build-time environment variables:" > /tmp/env.log
RUN echo "VITE_API_URL=$VITE_API_URL" >> /tmp/env.log
RUN echo "VITE_STRIPE_PUBLISHABLE_KEY=$VITE_STRIPE_PUBLISHABLE_KEY" >> /tmp/env.log
RUN cat /tmp/env.log

# Build the app
RUN npm run build

# Debug built assets
RUN ls -la /app/dist
RUN ls -la /app/dist/assets
RUN grep -r VITE_STRIPE_PUBLISHABLE_KEY /app/dist || echo "No direct VITE_STRIPE_PUBLISHABLE_KEY references found (expected due to Vite replacement)"

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

# Create directories for SSL certificates
RUN mkdir -p /etc/ssl/needle360 /etc/ssl/private

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built app
COPY --from=build /app/dist /usr/share/nginx/html

# Debug final assets
RUN ls -la /usr/share/nginx/html
RUN ls -la /usr/share/nginx/html/assets
RUN grep -r pk_test_51RH5dSPCpJjalvEJ /usr/share/nginx/html/assets || echo "No Stripe key found in assets"

EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]