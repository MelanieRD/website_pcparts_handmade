# Test script to verify the authentication fix
# This script will test the admin endpoints to ensure the middleware is working correctly

Write-Host "🧪 Testing Authentication Fix" -ForegroundColor Green
Write-Host "=============================" -ForegroundColor Green

$baseUrl = "http://localhost:3001"

# Step 1: Test health endpoint
Write-Host "`n1. Testing health endpoint..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-RestMethod -Uri "$baseUrl/api/health" -Method GET
    Write-Host "✅ Health check passed: $($healthResponse.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Health check failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 2: Login as admin
Write-Host "`n2. Logging in as admin..." -ForegroundColor Yellow
$loginData = @{
    email = "admin@cyborgtech.com"
    password = "admin123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "✅ Login successful: $($loginResponse.user.email)" -ForegroundColor Green
    Write-Host "   Token: $($token.Substring(0, 20))..." -ForegroundColor Gray
} catch {
    Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 3: Test admin endpoint with token
Write-Host "`n3. Testing admin endpoint with token..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $adminResponse = Invoke-RestMethod -Uri "$baseUrl/api/admin/products" -Method GET -Headers $headers
    Write-Host "✅ Admin endpoint access successful!" -ForegroundColor Green
    Write-Host "   Products count: $($adminResponse.Count)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Admin endpoint access failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    exit 1
}

# Step 4: Test admin endpoint without token (should fail)
Write-Host "`n4. Testing admin endpoint without token (should fail)..." -ForegroundColor Yellow
try {
    $noTokenResponse = Invoke-RestMethod -Uri "$baseUrl/api/admin/products" -Method GET
    Write-Host "❌ Admin endpoint should have failed without token!" -ForegroundColor Red
    exit 1
} catch {
    Write-Host "✅ Admin endpoint correctly rejected request without token" -ForegroundColor Green
    Write-Host "   Expected error: $($_.Exception.Message)" -ForegroundColor Gray
}

# Step 5: Test regular user endpoint with token
Write-Host "`n5. Testing regular user endpoint with token..." -ForegroundColor Yellow
try {
    $userResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/me" -Method GET -Headers $headers
    Write-Host "✅ User endpoint access successful!" -ForegroundColor Green
    Write-Host "   User: $($userResponse.name) ($($userResponse.email))" -ForegroundColor Gray
    Write-Host "   Role: $($userResponse.role)" -ForegroundColor Gray
} catch {
    Write-Host "❌ User endpoint access failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n🎉 All tests passed! Authentication fix is working correctly." -ForegroundColor Green
Write-Host "=========================================================" -ForegroundColor Green 