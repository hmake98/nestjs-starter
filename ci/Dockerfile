# Build stage
FROM node:20-alpine AS builder

# Install build dependencies
RUN apk add --no-cache --virtual .build-deps alpine-sdk python3

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile --production=false

# Copy Prisma schema
COPY prisma ./prisma

# Generate Prisma client
RUN yarn generate

# Copy source files
COPY . .

# Build the application
RUN yarn build

# Remove dev dependencies
RUN yarn install --frozen-lockfile --production=true

# Production stage
FROM node:20-alpine

# Install runtime dependencies
RUN apk add --no-cache dumb-init

# Set working directory
WORKDIR /app

# Copy built artifacts and dependencies from builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Change ownership of the app directory
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose the port the app runs on
EXPOSE 3001

# Use dumb-init as the entrypoint
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Start the application
CMD ["yarn", "start"]