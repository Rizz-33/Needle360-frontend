# Stage 1: Build the React app
FROM node:18-alpine as build
WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies (using npm install instead of ci)
RUN npm install --legacy-peer-deps

# Copy the rest of the files
COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the app
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]