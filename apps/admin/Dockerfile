FROM node:18-alpine AS build-stage

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package.json package-lock.json ./

# Install the dependencies
RUN npm install

# Copy the public and src directories into the container
COPY public/ ./public/
COPY src/ ./src/

# Run the build process (e.g., for production)
RUN npm run build

# Use Nginx for serving the built app in the final image
FROM nginx:stable-alpine AS production-stage

# Copy the build artifacts from the build stage
COPY --from=build-stage /app/build /usr/share/nginx/html

# Expose the port Nginx will run on
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]