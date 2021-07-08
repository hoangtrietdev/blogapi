FROM node:14 as server

WORKDIR /server

COPY ./packages/server/package*.json ./packages/server/package*.jsonyarn.lock /server/

RUN yarn 

COPY . ./


CMD ["yarn", "server"]