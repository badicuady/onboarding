FROM node:13.6.0-alpine

WORKDIR /usr/src/restapicore

COPY package*.json ./

RUN npm cache clean --force && npm install --only=prod && node --version

COPY . .

COPY ./oauth.js ./node_modules/fastify-oauth2/index.js

EXPOSE 3000

CMD npm run start-docker