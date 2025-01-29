# Step 1: Build the application
FROM node:16-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Serve the built app with Nginx
FROM nginx:1.23-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

# Copy build output based on environment variable
ARG APP_ENV
COPY --from=build /app/${APP_ENV}/build .

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
