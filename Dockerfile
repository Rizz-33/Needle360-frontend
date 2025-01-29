# Use official Node.js image
FROM node:16-alpine AS build

# Set the working directory
WORKDIR /app

# Copy only package.json (no package-lock.json)
COPY package.json ./

# Install dependencies (this will install all dependencies from package.json including web-vitals)
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the app (this will now work if all dependencies are installed)
RUN npm run build

# Use NGINX to serve the app (optional, you can modify this based on your setup)
FROM nginx:1.23-alpine

# Copy built files from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start NGINX server
CMD ["nginx", "-g", "daemon off;"]
