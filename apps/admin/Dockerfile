# Set base image
FROM node:latest AS builder

# Set working directory
WORKDIR /app

# Copy package.json and install packages
COPY package.json .
RUN npm install

# Copy other project files and build
COPY . ./
RUN npm run build

# Set nginx image
FROM nginx:latest

# Nginx config
RUN rm -rf /etc/nginx/conf.d/default.conf
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Static build
COPY --from=builder /app/build /usr/share/nginx/html

# Set working directory
WORKDIR /usr/share/nginx/html

# Start Nginx server
CMD ["/bin/bash", "-c", "nginx -g \"daemon off;\""]
