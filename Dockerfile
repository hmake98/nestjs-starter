FROM node:12-alpine

WORKDIR /app

RUN apk add --no-cache --virtual .build-deps alpine-sdk python make gcc g++ 

COPY package*.json ./

RUN npm install --frozen-lockfile

COPY . .

EXPOSE 3000

CMD [ "npm",  "start" ]