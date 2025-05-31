# Stage 1: Build the React app
FROM node:18-alpine as build
WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the files
COPY . .

# Set build arguments - these are for Dockerfile context, not directly for Vite
ARG VITE_API_URL
ARG VITE_STRIPE_PUBLISHABLE_KEY

# Build the app - The environment variables will be passed by the workflow
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

# ... (rest of your Nginx configuration)

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]