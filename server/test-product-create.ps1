# Test Product Creation

Write-Host "Step 1: Login..." -ForegroundColor Green
$loginResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"melanie@cyborgtech.com","password":"melanie"}'

Write-Host "Login successful!" -ForegroundColor Green

$headers = @{
    "Authorization" = "Bearer $($loginResponse.token)"
    "Content-Type" = "application/json"
}

Write-Host "`nStep 2: Testing product creation..." -ForegroundColor Green

$testProduct = @{
    id = "test-product-$(Get-Date -Format 'yyyyMMddHHmmss')"
    name = @{
        es = "Producto de Prueba"
        en = "Test Product"
        fr = "Produit de Test"
    }
    description = @{
        es = "Descripción del producto de prueba"
        en = "Test product description"
        fr = "Description du produit de test"
    }
    price = "99.99"
    image = "test-image.jpg"
    category = "electronics"
    subcategory = "computers"
    original_price = "129.99"
    images = @("image1.jpg", "image2.jpg")
    specs = @{
        "color" = "black"
        "weight" = "1.5kg"
        "dimensions" = "15x10x5cm"
    }
    brand = "TestBrand"
    is_new = $true
    is_popular = $false
    is_offer = $true
} | ConvertTo-Json -Depth 10

Write-Host "Product data: $testProduct" -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/admin/products" -Method POST -Headers $headers -Body $testProduct
    Write-Host "✅ Product creation successful!" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json)" -ForegroundColor Yellow
} catch {
    Write-Host "❌ Product creation failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        Write-Host "Status Text: $($_.Exception.Response.StatusDescription)" -ForegroundColor Red
    }
} 