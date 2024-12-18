# Use Node.js for building the app
FROM node:16-alpine AS build

WORKDIR /app

# Copy only the necessary package.json files for dependencies installation
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the entire admin app source code into the container
COPY . .

# Run the build command
RUN npm run build

# Use Nginx to serve the app
FROM nginx:1.23-alpine

WORKDIR /usr/share/nginx/html

# Clean the existing files in Nginx default directory
RUN rm -rf *

# Copy the build output from the build container
COPY --from=build /app/build .

# Expose port 80 for the Nginx server
EXPOSE 80

# Run Nginx in the foreground
ENTRYPOINT ["nginx", "-g", "daemon off;"]
