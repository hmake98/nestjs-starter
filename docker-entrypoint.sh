#!/bin/sh
set -e

echo "Generating Prisma client..."
npm run db:generate

echo "Running database migrations..."
npm run db:migrate-prod

echo "Starting application..."
exec "$@"
