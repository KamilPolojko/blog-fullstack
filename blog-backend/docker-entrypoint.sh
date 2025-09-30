#!/bin/sh
set -e

echo "🔍 Checking if migrations are needed..."

if ! npx typeorm query "SELECT * FROM migrations LIMIT 1" 2>/dev/null; then
    echo "🚀 First run - executing migrations..."
    npx typeorm migration:run -d dist/db/data-source.js
    echo "✅ Migrations completed!"
else
    echo "✅ Database is up to date - skipping migrations"
fi

echo "🏃 Starting NestJS application..."
exec "$@"