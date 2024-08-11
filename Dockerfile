FROM node:20.11.1-alpine3.19

RUN apk add --no-cache --virtual .build-deps \
    alpine-sdk \
    python3

WORKDIR /app

COPY package.json yarn.lock ./

COPY prisma ./prisma/

RUN yarn install --frozen-lockfile

RUN yarn generate

COPY . .

EXPOSE 3001

CMD ["yarn", "dev"]
