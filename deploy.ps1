# CyborgTech Vercel Deployment Script (PowerShell)
# This script helps deploy both client and server to Vercel

param(
    [Parameter(Position=0)]
    [ValidateSet("server", "client", "both", "help")]
    [string]$Target = "both"
)

Write-Host "🚀 CyborgTech Vercel Deployment Script" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green

# Check if Vercel CLI is installed
try {
    $null = Get-Command vercel -ErrorAction Stop
    Write-Host "✅ Vercel CLI is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI is not installed. Please install it first:" -ForegroundColor Red
    Write-Host "   npm i -g vercel" -ForegroundColor Yellow
    exit 1
}

# Check if user is logged in to Vercel
try {
    $null = vercel whoami 2>$null
    Write-Host "✅ You are logged in to Vercel" -ForegroundColor Green
} catch {
    Write-Host "❌ You are not logged in to Vercel. Please login first:" -ForegroundColor Red
    Write-Host "   vercel login" -ForegroundColor Yellow
    exit 1
}

# Function to deploy server
function Deploy-Server {
    Write-Host ""
    Write-Host "🔧 Deploying Server (Rust Backend)..." -ForegroundColor Cyan
    Write-Host "=====================================" -ForegroundColor Cyan
    
    Set-Location server
    
    Write-Host "📦 Deploying server to Vercel..." -ForegroundColor Yellow
    vercel --yes
    
    Write-Host "✅ Server deployment initiated!" -ForegroundColor Green
    Write-Host "📝 Please set up environment variables in your Vercel dashboard:" -ForegroundColor Yellow
    Write-Host "   - MONGODB_URI" -ForegroundColor White
    Write-Host "   - JWT_SECRET" -ForegroundColor White
    Write-Host ""
    Write-Host "🔗 After setting environment variables, run: vercel --prod" -ForegroundColor Yellow
    
    Set-Location ..
}

# Function to deploy client
function Deploy-Client {
    Write-Host ""
    Write-Host "🎨 Deploying Client (React Frontend)..." -ForegroundColor Cyan
    Write-Host "======================================" -ForegroundColor Cyan
    
    Set-Location client
    
    Write-Host "📦 Deploying client to Vercel..." -ForegroundColor Yellow
    vercel --yes
    
    Write-Host "✅ Client deployment initiated!" -ForegroundColor Green
    Write-Host "📝 Please set up environment variables in your Vercel dashboard:" -ForegroundColor Yellow
    Write-Host "   - VITE_API_URL (set to your server URL)" -ForegroundColor White
    Write-Host ""
    Write-Host "🔗 After setting environment variables, run: vercel --prod" -ForegroundColor Yellow
    
    Set-Location ..
}

# Function to show help
function Show-Help {
    Write-Host "Usage: .\deploy.ps1 [OPTION]" -ForegroundColor White
    Write-Host ""
    Write-Host "Options:" -ForegroundColor White
    Write-Host "  server    Deploy only the server" -ForegroundColor White
    Write-Host "  client    Deploy only the client" -ForegroundColor White
    Write-Host "  both      Deploy both server and client (default)" -ForegroundColor White
    Write-Host "  help      Show this help message" -ForegroundColor White
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor White
    Write-Host "  .\deploy.ps1 server    # Deploy only server" -ForegroundColor White
    Write-Host "  .\deploy.ps1 client    # Deploy only client" -ForegroundColor White
    Write-Host "  .\deploy.ps1 both      # Deploy both (default)" -ForegroundColor White
    Write-Host "  .\deploy.ps1           # Deploy both (default)" -ForegroundColor White
}

# Main script logic
switch ($Target) {
    "server" {
        Deploy-Server
    }
    "client" {
        Deploy-Client
    }
    "both" {
        Deploy-Server
        Deploy-Client
    }
    "help" {
        Show-Help
        exit 0
    }
}

Write-Host ""
Write-Host "🎉 Deployment script completed!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host "1. Set up environment variables in Vercel dashboard" -ForegroundColor White
Write-Host "2. Redeploy with: vercel --prod" -ForegroundColor White
Write-Host "3. Test your endpoints" -ForegroundColor White
Write-Host "4. Update client API URL to point to your server" -ForegroundColor White
Write-Host ""
Write-Host "📚 For detailed instructions, see:" -ForegroundColor Yellow
Write-Host "   - VERCEL_DEPLOYMENT.md" -ForegroundColor White
Write-Host "   - client/DEPLOYMENT.md" -ForegroundColor White
Write-Host "   - server/DEPLOYMENT.md" -ForegroundColor White 