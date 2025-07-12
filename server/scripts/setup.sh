#!/bin/bash

# CyborgTech Server Setup Script

echo "🚀 Setting up CyborgTech Server..."

# Check if Rust is installed
if ! command -v cargo &> /dev/null; then
    echo "❌ Rust is not installed. Please install Rust first:"
    echo "   Visit https://rustup.rs/ and follow the installation instructions"
    exit 1
fi

echo "✅ Rust is installed"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "⚠️  Please edit .env file and add your MongoDB Atlas connection string"
    echo "   Example: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cyborgtech?retryWrites=true&w=majority"
else
    echo "✅ .env file already exists"
fi

# Build the project
echo "🔨 Building the project..."
cargo build

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    exit 1
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your MongoDB Atlas connection string"
echo "2. Run: cargo run"
echo "3. Seed the database: curl -X POST http://localhost:3000/api/seed"
echo "4. Test the API: curl http://localhost:3000/api/health"
echo ""
echo "Happy coding! 🚀" 