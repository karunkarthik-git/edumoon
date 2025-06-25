#!/bin/bash

# MongoDB Setup and Practice Script
# This script helps you set up MongoDB and practice with the sample dataset

echo "🚀 MongoDB Practice Setup"
echo "========================"

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "❌ MongoDB is not installed or not in PATH"
    echo "Please install MongoDB first:"
    echo "  - Visit: https://docs.mongodb.com/manual/installation/"
    echo "  - Or use Homebrew: brew install mongodb-community"
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "🔧 Starting MongoDB..."
    # Start MongoDB in background
    mongod --config /usr/local/etc/mongod.conf --fork
    sleep 3
fi

echo "✅ MongoDB is running"

# Check if mongosh is available
if command -v mongosh &> /dev/null; then
    MONGO_SHELL="mongosh"
elif command -v mongo &> /dev/null; then
    MONGO_SHELL="mongo"
else
    echo "❌ MongoDB shell not found"
    echo "Please install MongoDB shell (mongosh)"
    exit 1
fi

echo "📂 Current directory: $(pwd)"
echo "🗄️  Loading sample data..."

# Load the sample data
if [ -f "sample-data.js" ]; then
    $MONGO_SHELL --eval "load('$(pwd)/sample-data.js')"
    echo "✅ Sample data loaded successfully!"
else
    echo "❌ sample-data.js not found in current directory"
    echo "Please make sure you're in the mongodb-practice directory"
    exit 1
fi

echo ""
echo "🎯 Practice Suggestions:"
echo "1. Open MongoDB shell: $MONGO_SHELL"
echo "2. Switch to database: use('ecommerce')"
echo "3. Explore collections: show collections"
echo "4. Try queries from mongodb-queries.md"
echo ""
echo "📚 Available collections:"
echo "  - users (5 sample users)"
echo "  - products (6 sample products)"
echo "  - orders (4 sample orders)"
echo "  - categories (5 categories)"
echo "  - reviews (5 sample reviews)"
echo ""
echo "🔍 Quick start commands:"
echo "  db.users.find().pretty()"
echo "  db.products.find({price: {\$lt: 100}})"
echo "  db.orders.find({status: 'delivered'})"
echo ""
echo "Happy learning! 🎉"
