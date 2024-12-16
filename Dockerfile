FROM node:alpine3.18 AS build
ARG APP
WORKDIR /app

COPY ${APP}/package.json ${APP}/package-lock.json ./
RUN npm install

COPY ${APP} ./
RUN npm run build

FROM nginx:1.23-alpine
WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=build /app/build ./

EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
