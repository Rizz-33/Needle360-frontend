# Use official Node.js image
FROM node:alpine3.18 AS build

# Set the working directory
WORKDIR /app

# Copy only package.json (no package-lock.json)
COPY package.json ./

# Install dependencies (this will install all dependencies from package.json including web-vitals)
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the app (this will now work if all dependencies are installed)
RUN npm run build --output-path=build

# Use NGINX to serve the app (optional, you can modify this based on your setup)
FROM nginx:1.23-alpine

# Copy built files from the build stage
WORKDIR /usr/share/nginx/html

# Remove default NGINX static files
RUN rm -rf ./*

# Copy built files from the build stage
COPY --from=build /app/build .

# Expose port
EXPOSE 80

# Start NGINX server
ENTRYPOINT ["nginx", "-g", "daemon off;"]
