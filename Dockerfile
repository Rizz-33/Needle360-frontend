# Stage 1: Build React App
FROM node:alpine3.18 AS build
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Build the React app (output is in /app/build)
RUN npm run build

# Debugging: Check if build directory exists
RUN ls -la /app/build

# Stage 2: Serve with Nginx
FROM nginx:1.23-alpine
WORKDIR /usr/share/nginx/html

# Remove default NGINX static files
RUN rm -rf ./*

# Copy built files from the build stage
COPY --from=build /app/build .

# Expose port
EXPOSE 80

# Start NGINX server
ENTRYPOINT ["nginx", "-g", "daemon off;"]
