FROM node:13.14-alpine

RUN mkdir -p /usr/onboarding/api

WORKDIR /usr/onboarding/api

COPY ./dist ./

ENV PORT=3123

EXPOSE 3123

#CMD node ./index.js --env=docker
CMD node ./index.js --env=localdocker
