# Use Node.js image to build the app
FROM node:alpine3.18 as build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the app (e.g., for React or similar)
RUN npm run build

# Use Nginx to serve the app
FROM nginx:1.23-alpine

# Set the working directory for Nginx
WORKDIR /usr/share/nginx/html

# Remove the default Nginx content
RUN rm -rf ./*

# Copy the built files from the 'build' stage
COPY --from=build /app/build .

# Expose port 80 to allow access
EXPOSE 80

# Set Nginx to run in the foreground
ENTRYPOINT ["nginx", "-g", "daemon off;"]
