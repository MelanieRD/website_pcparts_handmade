# Debug Frontend Issue - Simulate what frontend should do

Write-Host "Step 1: Login to get token..." -ForegroundColor Green
$loginResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"melanie@cyborgtech.com","password":"melanie"}'

$token = $loginResponse.token
Write-Host "Token obtained: $($token.Substring(0, 50))..." -ForegroundColor Yellow

Write-Host "`nStep 2: Test with CORRECT headers (should work)..." -ForegroundColor Green
$correctHeaders = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$testProduct = @{
    id = "test-frontend-$(Get-Date -Format 'yyyyMMddHHmmss')"
    name = @{
        es = "Producto Frontend"
        en = "Frontend Product"
        fr = "Produit Frontend"
    }
    description = @{
        es = "Descripción del producto frontend"
        en = "Frontend product description"
        fr = "Description du produit frontend"
    }
    price = "149.99"
    image = "frontend-image.jpg"
    category = "electronics"
    subcategory = "phones"
} | ConvertTo-Json -Depth 5

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/admin/products" -Method POST -Headers $correctHeaders -Body $testProduct
    Write-Host "✅ CORRECT headers - SUCCESS!" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json)" -ForegroundColor Yellow
} catch {
    Write-Host "❌ CORRECT headers - FAILED!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nStep 3: Test with MISSING Content-Type header (should fail with 415)..." -ForegroundColor Green
$missingContentTypeHeaders = @{
    "Authorization" = "Bearer $token"
    # Missing Content-Type header
}

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/admin/products" -Method POST -Headers $missingContentTypeHeaders -Body $testProduct
    Write-Host "❌ MISSING Content-Type - Should have failed but didn't!" -ForegroundColor Red
} catch {
    Write-Host "✅ MISSING Content-Type - Failed as expected!" -ForegroundColor Green
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "`nStep 4: Test with WRONG Content-Type header (should fail with 415)..." -ForegroundColor Green
$wrongContentTypeHeaders = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "text/plain"  # Wrong content type
}

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/admin/products" -Method POST -Headers $wrongContentTypeHeaders -Body $testProduct
    Write-Host "❌ WRONG Content-Type - Should have failed but didn't!" -ForegroundColor Red
} catch {
    Write-Host "✅ WRONG Content-Type - Failed as expected!" -ForegroundColor Green
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "`nStep 5: Test with FormData instead of JSON (should fail with 415)..." -ForegroundColor Green
$formData = [System.Collections.Specialized.NameValueCollection]@{
    "id" = "test-formdata"
    "name" = "Test FormData"
    "price" = "99.99"
}

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/admin/products" -Method POST -Headers @{"Authorization" = "Bearer $token"} -Body $formData
    Write-Host "❌ FormData - Should have failed but didn't!" -ForegroundColor Red
} catch {
    Write-Host "✅ FormData - Failed as expected!" -ForegroundColor Green
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Yellow
} 