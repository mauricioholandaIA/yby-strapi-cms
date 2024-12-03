FROM node:20.15.1-alpine3.20 as build-stage

ENV DATABASE_HOST=${POSTGRES_HOST}
ENV DATABASE_PORT=${POSTGRES_PORT}
ENV DATABASE_NAME=${POSTGRES_DB}
ENV DATABASE_USERNAME=${POSTGRES_USER}
ENV DATABASE_PASSWORD=${POSTGRES_PASSWORD}

WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.22.1-alpine as prod-stage
COPY --from=build-stage /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
