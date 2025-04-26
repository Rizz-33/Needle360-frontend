FROM node:alpine3.18 AS build

# ARG VITE_API_BASE_URL

# ENV VITE_API_BASE_URL=${API_URL}

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build || (echo "Build failed!" && exit 1)

RUN ls -la /app/dist

FROM nginx:1.23-alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=build /app/dist .

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
