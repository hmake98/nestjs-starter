# Build stage
FROM node:lts-alpine AS builder

# Install build dependencies
RUN apk add --no-cache --virtual .build-deps \
    alpine-sdk \
    python3 \
    make \
    g++

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies (including devDependencies for building)
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma client and build the application
RUN yarn prisma generate && yarn build

# Remove devDependencies and build deps
RUN yarn install --production --frozen-lockfile && \
    apk del .build-deps

# Production stage
FROM node:lts-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Copy built application from builder stage
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./
COPY --from=builder --chown=nestjs:nodejs /app/yarn.lock ./
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node healthcheck.js

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["yarn", "start"]
