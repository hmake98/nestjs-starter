FROM node:20-alpine AS builder

RUN apk add --no-cache --virtual .build-deps alpine-sdk python3

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY prisma ./prisma
RUN yarn generate

COPY . .

RUN yarn build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/dist ./dist

EXPOSE 3001

CMD ["yarn", "start"]
