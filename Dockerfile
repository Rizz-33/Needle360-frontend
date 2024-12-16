# Build Stage
FROM node:alpine3.18 AS build
ARG APP
WORKDIR /app

# Copy package.json and package-lock.json files
COPY ${APP}/package.json ${APP}/package-lock.json ./
RUN npm install

# Copy application source code and build the app
COPY ${APP} ./
RUN npm run build

# Serve Stage
FROM nginx:1.23-alpine
WORKDIR /usr/share/nginx/html

# Clean existing Nginx HTML folder
RUN rm -rf ./*

# Copy built application from the build stage
COPY --from=build /app/build ./

# Expose port 80 and start Nginx
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
