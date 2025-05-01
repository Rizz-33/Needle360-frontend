FROM node:alpine3.18

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 5173

# Use npm run dev for development with hot-reloading
CMD ["npm", "run", "dev"]

# Or for production build:
# RUN npm run build
# CMD ["npm", "run", "preview"]