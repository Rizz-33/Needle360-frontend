# Step 1: Build the application
FROM node:16-alpine AS build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . . 
RUN npm run build

# Step 2: Serve the built app with Nginx
FROM nginx:1.23-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf *
COPY --from=build /app/build .
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
