FROM node:alpine3.18
ARG APP
WORKDIR /app
COPY ${APP}/package.json ${APP}/package-lock.json ./${APP}/
RUN npm install --prefix ${APP}
COPY ${APP} ./${APP}/
RUN npm run build --prefix ${APP}

FROM nginx:1.23-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=0 /app/${APP}/build ./
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
