# Test Admin Authentication Flow

Write-Host "Step 1: Testing login..." -ForegroundColor Green
$loginResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"admin@cyborgtech.com","password":"admin123"}'

Write-Host "Login successful!" -ForegroundColor Green
Write-Host "Token: $($loginResponse.token)" -ForegroundColor Yellow

Write-Host "`nStep 2: Testing admin access..." -ForegroundColor Green
$headers = @{
    "Authorization" = "Bearer $($loginResponse.token)"
    "Content-Type" = "application/json"
}

try {
    $adminResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/admin/products" -Method GET -Headers $headers
    Write-Host "Admin access successful!" -ForegroundColor Green
    Write-Host "Response: $($adminResponse | ConvertTo-Json)" -ForegroundColor Yellow
} catch {
    Write-Host "Admin access failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
}

Write-Host "`nStep 3: Testing current user endpoint..." -ForegroundColor Green
try {
    $userResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/me" -Method GET -Headers $headers
    Write-Host "Current user endpoint successful!" -ForegroundColor Green
    Write-Host "User: $($userResponse | ConvertTo-Json)" -ForegroundColor Yellow
} catch {
    Write-Host "Current user endpoint failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
} 