FROM node:18-alpine AS build-stage

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Use Nginx for serving the built app in the final image
FROM nginx:stable-alpine AS production-stage

# Copy the build artifacts from the build stage
COPY --from=build-stage /app/build /usr/share/nginx/html

# Expose the port Nginx will run on
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]