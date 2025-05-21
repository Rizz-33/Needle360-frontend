# Stage 1: Build the React app
FROM node:18-alpine as build
WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies (using npm install instead of ci)
RUN npm install --legacy-peer-deps

# Copy the rest of the files
COPY . .

ARG VITE_API_URL
ARG VITE_STRIPE_PUBLISHABLE_KEY
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_STRIPE_PUBLISHABLE_KEY=$VITE_STRIPE_PUBLISHABLE_KEY

# Build the app
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

# Create directories for SSL certificates
RUN mkdir -p /etc/ssl/needle360 /etc/ssl/private

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built app
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]