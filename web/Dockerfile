FROM node:13.14-alpine

RUN mkdir -p /usr/src/onboarding/web

WORKDIR /usr/src/onboarding/web

COPY ./__sapper__/build ./__sapper__/build

COPY ./static/ ./static

COPY ./server.package.json ./package.json

ENV PORT=4123
ENV ENV=localdocker

EXPOSE 4123

CMD node __sapper__/build/index.js