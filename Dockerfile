FROM node:lts-alpine

# Install build dependencies
RUN apk add --no-cache --virtual .build-deps \
    alpine-sdk \
    python3

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Copy Prisma schema
COPY prisma ./prisma/

# Install dependencies
RUN yarn install --frozen-lockfile

# Generate Prisma client
RUN yarn generate

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Change ownership
RUN chown -R nestjs:nodejs /app
USER nestjs

# Expose port
EXPOSE 3001

# Start development server
CMD ["yarn", "dev"]
