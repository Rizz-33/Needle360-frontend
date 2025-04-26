FROM node:alpine3.18 AS build

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
