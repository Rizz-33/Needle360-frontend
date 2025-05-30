# Stage 1: Build the React app
FROM node:18-alpine as build
WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Set build arguments with defaults
ARG VITE_API_URL=http://localhost:4000
ARG VITE_STRIPE_PUBLISHABLE_KEY
ARG NODE_ENV=production

# Create .env file from build args
RUN echo "VITE_API_URL=${VITE_API_URL}" > .env
RUN echo "VITE_STRIPE_PUBLISHABLE_KEY=${VITE_STRIPE_PUBLISHABLE_KEY}" >> .env
RUN echo "NODE_ENV=${NODE_ENV}" >> .env

# Verify .env file
RUN cat .env

# Build the application with production mode
RUN npm run build

# Verify built assets
RUN find dist -type f -exec ls -lh {} \;