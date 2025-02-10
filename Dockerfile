# Stage 1: Build Vite App
FROM node:alpine3.18 AS build
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Build the Vite app
RUN npm run build || (echo "Build failed!" && exit 1)

# Debugging: Check if dist directory exists
RUN ls -la /app/dist

# Stage 2: Serve with Nginx
FROM nginx:1.23-alpine
WORKDIR /usr/share/nginx/html

# Remove default NGINX static files
RUN rm -rf ./*

# Copy built files from the build stage (dist instead of build)
COPY --from=build /app/dist .

# Expose port
EXPOSE 80

# Start NGINX server
ENTRYPOINT ["nginx", "-g", "daemon off;"]
