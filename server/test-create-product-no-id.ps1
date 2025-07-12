# Test Product Creation Without ID

Write-Host "Step 1: Login..." -ForegroundColor Green
$loginResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"melanie@cyborgtech.com","password":"melanie"}'

Write-Host "Login successful!" -ForegroundColor Green

$headers = @{
    "Authorization" = "Bearer $($loginResponse.token)"
    "Content-Type" = "application/json"
}

Write-Host "`nStep 2: Testing product creation WITHOUT id field..." -ForegroundColor Green

$testProduct = @{
    # NO id field - should be generated automatically
    name = @{
        es = "Producto Sin ID"
        en = "Product Without ID"
        fr = "Produit Sans ID"
    }
    description = @{
        es = "Descripción del producto sin ID"
        en = "Product description without ID"
        fr = "Description du produit sans ID"
    }
    price = "199.99"
    image = "no-id-image.jpg"
    category = "electronics"
    subcategory = "laptops"
    original_price = "249.99"
    images = @("image1.jpg", "image2.jpg", "image3.jpg")
    specs = @{
        "processor" = "Intel i7"
        "ram" = "16GB"
        "storage" = "512GB SSD"
        "display" = "15.6 inch"
    }
    brand = "TestBrand"
    is_new = $true
    is_popular = $true
    is_offer = $false
} | ConvertTo-Json -Depth 10

Write-Host "Product data (without id): $testProduct" -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/admin/products" -Method POST -Headers $headers -Body $testProduct
    Write-Host "✅ Product creation WITHOUT id - SUCCESS!" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json)" -ForegroundColor Yellow
} catch {
    Write-Host "❌ Product creation WITHOUT id - FAILED!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        Write-Host "Status Text: $($_.Exception.Response.StatusDescription)" -ForegroundColor Red
    }
}

Write-Host "`nStep 3: Testing product creation with MINIMAL fields..." -ForegroundColor Green

$minimalProduct = @{
    name = @{
        es = "Producto Mínimo"
        en = "Minimal Product"
        fr = "Produit Minimal"
    }
    description = @{
        es = "Descripción mínima"
        en = "Minimal description"
        fr = "Description minimale"
    }
    price = "99.99"
    image = "minimal.jpg"
    category = "test"
    subcategory = "test"
} | ConvertTo-Json -Depth 5

Write-Host "Minimal product data: $minimalProduct" -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/admin/products" -Method POST -Headers $headers -Body $minimalProduct
    Write-Host "✅ Minimal product creation - SUCCESS!" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json)" -ForegroundColor Yellow
} catch {
    Write-Host "❌ Minimal product creation - FAILED!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        Write-Host "Status Text: $($_.Exception.Response.StatusDescription)" -ForegroundColor Red
    }
} 