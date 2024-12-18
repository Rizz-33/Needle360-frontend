# Stage 1: Build the React app for admin
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY apps/admin/package.json apps/admin/package-lock.json ./
RUN npm install

# Copy the admin app source code
COPY apps/admin/src ./src
COPY apps/admin/public ./public

# Build the app
RUN npm run build

# Stage 2: Set up production environment with NGINX
FROM nginx:stable-alpine

# Copy the built app to NGINX's web directory
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
