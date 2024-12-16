# Use Node image as base image
FROM node:alpine3.18 as build

# Set working directory
WORKDIR /app

# Copy package.json files
COPY package*.json ./

# Set npm config to increase fetch-timeout and install dependencies
RUN npm config set fetch-timeout 60000 && npm install --legacy-peer-deps

# Stage 2: Copy the app into the nginx image
FROM nginx:1.23-alpine

# Clean default nginx HTML
RUN rm -rf /usr/share/nginx/html/*

# Copy the built app from the build stage
COPY --from=build /app /usr/share/nginx/html

# Expose the port that nginx will run on
EXPOSE 80
