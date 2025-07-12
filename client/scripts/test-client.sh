#!/bin/bash

# CyborgTech Client Test Script

echo "🧪 Testing CyborgTech Client with API..."

# Check if the server is running
echo "📡 Checking server status..."
SERVER_RESPONSE=$(curl -s http://localhost:3000/api/health)

if [ $? -eq 0 ]; then
    echo "✅ Server is running"
    echo "   Response: $SERVER_RESPONSE"
else
    echo "❌ Server is not running"
    echo "   Please start the server first:"
    echo "   cd ../server && cargo run"
    exit 1
fi

echo ""

# Check if client dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing client dependencies..."
    npm install
fi

echo ""

# Start the client in development mode
echo "🚀 Starting client in development mode..."
echo "   The client will be available at: http://localhost:5173"
echo "   Make sure the server is running at: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the client"
echo ""

npm run dev 