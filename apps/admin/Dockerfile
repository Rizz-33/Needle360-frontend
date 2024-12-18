FROM node:alpine3.18 AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:1.23-alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf *

COPY --from=build /apps/admin .

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
