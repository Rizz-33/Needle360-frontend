# Stage 1: Build the React app
FROM node:18-alpine as build

WORKDIR /app

# First copy only the files needed for dependencies installation
COPY package.json .
COPY package-lock.json .

RUN npm ci

# Then copy the rest of the files
COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]