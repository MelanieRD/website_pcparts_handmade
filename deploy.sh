#!/bin/bash

# CyborgTech Vercel Deployment Script
# This script helps deploy both client and server to Vercel

set -e

echo "🚀 CyborgTech Vercel Deployment Script"
echo "======================================"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Please install it first:"
    echo "   npm i -g vercel"
    exit 1
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "❌ You are not logged in to Vercel. Please login first:"
    echo "   vercel login"
    exit 1
fi

echo "✅ Vercel CLI is installed and you are logged in"

# Function to deploy server
deploy_server() {
    echo ""
    echo "🔧 Deploying Server (Rust Backend)..."
    echo "====================================="
    
    cd server
    
    echo "📦 Deploying server to Vercel..."
    vercel --yes
    
    echo "✅ Server deployment initiated!"
    echo "📝 Please set up environment variables in your Vercel dashboard:"
    echo "   - MONGODB_URI"
    echo "   - JWT_SECRET"
    echo ""
    echo "🔗 After setting environment variables, run: vercel --prod"
    
    cd ..
}

# Function to deploy client
deploy_client() {
    echo ""
    echo "🎨 Deploying Client (React Frontend)..."
    echo "======================================"
    
    cd client
    
    echo "📦 Deploying client to Vercel..."
    vercel --yes
    
    echo "✅ Client deployment initiated!"
    echo "📝 Please set up environment variables in your Vercel dashboard:"
    echo "   - VITE_API_URL (set to your server URL)"
    echo ""
    echo "🔗 After setting environment variables, run: vercel --prod"
    
    cd ..
}

# Function to show help
show_help() {
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  server    Deploy only the server"
    echo "  client    Deploy only the client"
    echo "  both      Deploy both server and client (default)"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 server    # Deploy only server"
    echo "  $0 client    # Deploy only client"
    echo "  $0 both      # Deploy both (default)"
    echo "  $0           # Deploy both (default)"
}

# Main script logic
case "${1:-both}" in
    "server")
        deploy_server
        ;;
    "client")
        deploy_client
        ;;
    "both")
        deploy_server
        deploy_client
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        echo "❌ Unknown option: $1"
        show_help
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment script completed!"
echo "======================================"
echo ""
echo "📋 Next steps:"
echo "1. Set up environment variables in Vercel dashboard"
echo "2. Redeploy with: vercel --prod"
echo "3. Test your endpoints"
echo "4. Update client API URL to point to your server"
echo ""
echo "📚 For detailed instructions, see:"
echo "   - VERCEL_DEPLOYMENT.md"
echo "   - client/DEPLOYMENT.md"
echo "   - server/DEPLOYMENT.md" 