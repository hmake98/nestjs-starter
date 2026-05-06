FROM node:20-alpine

# Install dependencies needed for native modules
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./

# Copy prisma schema and generate client
COPY prisma ./prisma/

RUN npm ci & npm run db:generate

# Copy source code (this layer changes most frequently)
COPY . .

# Expose application port
EXPOSE 3001

# Start development server with hot reload
CMD ["npm", "run", "dev"]
