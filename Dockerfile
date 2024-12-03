FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY config/ ./
COPY .env ./
RUN npm install

RUN mkdir -p public/uploads
COPY . .

EXPOSE 1337

CMD ["npm", "run", "develop"]
