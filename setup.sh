#!/bin/bash

echo "🚀 Setting up Simbro MCP Server (NestJS)"
echo "========================================"

# Check if PostgreSQL is running
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Check if database URL is configured
if grep -q "username:password@localhost" .env; then
    echo "⚠️  Please configure your DATABASE_URL in .env file"
    echo "   Edit .env and replace 'username:password@localhost:5432/simbro_db'"
    echo "   with your actual PostgreSQL connection details."
    echo ""
    echo "   Example:"
    echo "   DATABASE_URL=\"postgresql://myuser:mypassword@localhost:5432/simbro_db?schema=public\""
    echo ""
    echo "   After configuring the database URL, run:"
    echo "   npm run prisma:push"
    echo "   npm run seed"
    exit 0
fi

# Create database schema
echo "🗄️  Creating database schema..."
npx prisma db push

# Seed database
echo "🌱 Seeding database with sample data..."
npm run seed

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the MCP server:"
echo "  npm run start:dev"
echo ""
echo "To view the database:"
echo "  npm run prisma:studio"
