# Build stage
FROM node:20-alpine AS builder

# Install build dependencies
RUN apk add --no-cache --virtual .build-deps \
  alpine-sdk \
  python3 \
  make \
  g++

WORKDIR /app

# Install dependencies based on the package files
COPY package.json yarn.lock ./

# Install dependencies (including devDependencies for building)
RUN yarn install --frozen-lockfile

# Copy the rest of the application source code
COPY . .

# Generate Prisma client and build the application
RUN yarn prisma generate && yarn build

# Remove build dependencies and devDependencies
RUN yarn install --production --frozen-lockfile && \
    apk del .build-deps

# Production stage
FROM node:20-alpine

# Install runtime dependencies
RUN apk add --no-cache dumb-init

# Set the working directory
WORKDIR /app

# Copy necessary files and directories from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Ensure node_modules and other critical directories have correct permissions
RUN chown -R node:node /app

# Switch to a non-root user for better security
USER node

# Expose the port your application will run on
EXPOSE 3001

# Use dumb-init as the entrypoint to handle signals properly
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Start the application using Yarn
CMD ["yarn", "start"]