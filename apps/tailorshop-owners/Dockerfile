# Stage 1: Build the React app for tailorshop-owners
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY apps/tailorshop-owners/package.json ./
COPY apps/tailorshop-owners/package-lock.json ./
RUN npm install

# Copy the tailorshop-owners app source code
COPY apps/tailorshop-owners/src ./src
COPY apps/tailorshop-owners/public ./public

# Build the app
RUN npm run build

# Stage 2: Set up production environment with NGINX
FROM nginx:stable-alpine

# Copy the built app to NGINX's web directory
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]