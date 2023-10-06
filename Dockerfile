FROM node:16 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

# RUN npm run build

# FROM node:16

# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package*.json ./
# COPY --from=builder /app/dist ./dist

EXPOSE 3000

# CMD [ "npm", "start" ]

CMD [ "npm", "run", "dev" ]
