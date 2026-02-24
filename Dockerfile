FROM node:20-alpine

# Install dependencies needed for native modules
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy dependency files
COPY package.json yarn.lock ./

# Copy prisma schema and generate client
COPY prisma ./prisma/
RUN yarn install --frozen-lockfile
RUN yarn prisma:generate

# Copy source code (this layer changes most frequently)
COPY . .

# Expose application port
EXPOSE 3001

# Start development server with hot reload
CMD ["yarn", "dev"]
