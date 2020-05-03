FROM node:alpine

WORKDIR /usr/src/onboarding/api

COPY package*.json ./

RUN npm cache clean --force && npm install --only=prod && node --version

COPY ./dist ./

EXPOSE 3123

CMD npm run start-docker