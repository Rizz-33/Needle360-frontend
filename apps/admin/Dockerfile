FROM node:16-alpine AS build
WORKDIR /admin
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.23-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf *
COPY --from=build /admin/build .
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
