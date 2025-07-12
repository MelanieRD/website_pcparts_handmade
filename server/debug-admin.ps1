# Debug Admin Authentication Flow

Write-Host "Step 1: Testing login with Melanie's credentials..." -ForegroundColor Green
$loginResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"melanie@cyborgtech.com","password":"melanie"}'

Write-Host "Login successful!" -ForegroundColor Green
Write-Host "Token: $($loginResponse.token)" -ForegroundColor Yellow

$headers = @{
    "Authorization" = "Bearer $($loginResponse.token)"
    "Content-Type" = "application/json"
}

Write-Host "`nStep 2: Testing /api/auth/me (should work)..." -ForegroundColor Green
try {
    $userResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/me" -Method GET -Headers $headers
    Write-Host "✅ /api/auth/me successful!" -ForegroundColor Green
    Write-Host "User role: $($userResponse.role)" -ForegroundColor Yellow
    Write-Host "User name: $($userResponse.name)" -ForegroundColor Yellow
} catch {
    Write-Host "❌ /api/auth/me failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nStep 3: Testing /api/admin/products (GET)..." -ForegroundColor Green
try {
    $adminResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/admin/products" -Method GET -Headers $headers
    Write-Host "✅ /api/admin/products GET successful!" -ForegroundColor Green
    Write-Host "Products count: $($adminResponse.Count)" -ForegroundColor Yellow
} catch {
    Write-Host "❌ /api/admin/products GET failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}

Write-Host "`nStep 4: Testing /api/admin/handmade (GET)..." -ForegroundColor Green
try {
    $adminResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/admin/handmade" -Method GET -Headers $headers
    Write-Host "✅ /api/admin/handmade GET successful!" -ForegroundColor Green
    Write-Host "Handmade products count: $($adminResponse.Count)" -ForegroundColor Yellow
} catch {
    Write-Host "❌ /api/admin/handmade GET failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}

Write-Host "`nStep 5: Testing /api/admin/products (POST)..." -ForegroundColor Green
$testProduct = @{
    id = "test-123"
    name = @{
        es = "Producto de prueba"
        en = "Test Product"
        fr = "Produit de test"
    }
    description = @{
        es = "Descripción de prueba"
        en = "Test description"
        fr = "Description de test"
    }
    price = "99.99"
    image = "test.jpg"
    category = "test"
    subcategory = "test"
} | ConvertTo-Json

try {
    $adminResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/admin/products" -Method POST -Headers $headers -Body $testProduct
    Write-Host "✅ /api/admin/products POST successful!" -ForegroundColor Green
    Write-Host "Response: $($adminResponse | ConvertTo-Json)" -ForegroundColor Yellow
} catch {
    Write-Host "❌ /api/admin/products POST failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
} 