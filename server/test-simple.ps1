# Simple Admin Test

Write-Host "Step 1: Login..." -ForegroundColor Green
$loginResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"melanie@cyborgtech.com","password":"melanie"}'

Write-Host "Login successful!" -ForegroundColor Green

$headers = @{
    "Authorization" = "Bearer $($loginResponse.token)"
    "Content-Type" = "application/json"
}

Write-Host "`nStep 2: Testing /api/admin/test..." -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/admin/test" -Method GET -Headers $headers
    Write-Host "✅ /api/admin/test successful!" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json)" -ForegroundColor Yellow
} catch {
    Write-Host "❌ /api/admin/test failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
} 