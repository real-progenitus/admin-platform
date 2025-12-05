#!/bin/bash

echo "🚀 Setting up Admin Platform Database..."
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed."
    echo "Please install PostgreSQL first:"
    echo "  macOS: brew install postgresql@15"
    echo "  Linux: sudo apt-get install postgresql"
    exit 1
fi

echo "✅ PostgreSQL is installed"

# Check if PostgreSQL is running
if ! pg_isready &> /dev/null; then
    echo "❌ PostgreSQL is not running."
    echo "Start it with:"
    echo "  macOS: brew services start postgresql@15"
    echo "  Linux: sudo service postgresql start"
    exit 1
fi

echo "✅ PostgreSQL is running"

# Create database if it doesn't exist
echo ""
echo "Creating database 'admin_platform'..."
psql postgres -c "CREATE DATABASE admin_platform;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Database 'admin_platform' created"
else
    echo "ℹ️  Database 'admin_platform' already exists"
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo ""
    echo "Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created"
    echo "⚠️  Please update .env with your database credentials if needed"
else
    echo "ℹ️  .env file already exists"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Review .env file and update credentials if needed"
echo "2. Run: nx run admin-backend:seed"
echo "3. Run: nx dev admin-backend"
