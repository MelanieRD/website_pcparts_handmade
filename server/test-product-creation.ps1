# Test script to verify product creation fix
# This script will test creating a product without an ID field

Write-Host "🧪 Testing Product Creation Fix" -ForegroundColor Green
Write-Host "===============================" -ForegroundColor Green

$baseUrl = "http://localhost:3001"

# Step 1: Login as admin
Write-Host "`n1. Logging in as admin..." -ForegroundColor Yellow
$loginData = @{
    email = "admin@cyborgtech.com"
    password = "admin123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "✅ Login successful: $($loginResponse.user.email)" -ForegroundColor Green
} catch {
    Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 2: Create a test product (without ID field)
Write-Host "`n2. Creating a test product..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$productData = @{
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
    image = "https://example.com/test-image.jpg"
    category = "electronics"
    subcategory = "computers"
    original_price = "129.99"
    images = @("https://example.com/image1.jpg", "https://example.com/image2.jpg")
    specs = @{
        "Processor" = "Intel i7"
        "RAM" = "16GB"
        "Storage" = "512GB SSD"
    }
    brand = "TestBrand"
    is_new = $true
    is_popular = $false
    is_offer = $true
} | ConvertTo-Json -Depth 10

try {
    $createResponse = Invoke-RestMethod -Uri "$baseUrl/api/admin/products" -Method POST -Body $productData -Headers $headers
    Write-Host "✅ Product creation successful!" -ForegroundColor Green
    Write-Host "   Message: $($createResponse.message)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Product creation failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    exit 1
}

# Step 3: Verify the product was created by fetching all products
Write-Host "`n3. Verifying product was created..." -ForegroundColor Yellow
try {
    $productsResponse = Invoke-RestMethod -Uri "$baseUrl/api/admin/products" -Method GET -Headers $headers
    Write-Host "✅ Products fetched successfully!" -ForegroundColor Green
    Write-Host "   Total products: $($productsResponse.Count)" -ForegroundColor Gray
    
    # Find our test product
    $testProduct = $productsResponse | Where-Object { $_.name.en -eq "Test Product" }
    if ($testProduct) {
        Write-Host "   Test product found with ID: $($testProduct.id)" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Test product not found in the list" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Failed to fetch products: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 4: Test creating a handmade product
Write-Host "`n4. Creating a test handmade product..." -ForegroundColor Yellow
$handmadeData = @{
    name = @{
        es = "Producto Artesanal de Prueba"
        en = "Test Handmade Product"
        fr = "Produit Artisanal de Test"
    }
    description = @{
        es = "Descripción del producto artesanal"
        en = "Handmade product description"
        fr = "Description du produit artisanal"
    }
    long_description = @{
        es = "Descripción larga del producto artesanal de prueba"
        en = "Long description of the test handmade product"
        fr = "Description longue du produit artisanal de test"
    }
    price = "149.99"
    image = "https://example.com/handmade-image.jpg"
    images = @("https://example.com/handmade1.jpg", "https://example.com/handmade2.jpg")
    category = "handmade"
    subcategory = "jewelry"
    specs = @{
        "Material" = "Silver"
        "Weight" = "50g"
        "Size" = "Medium"
    }
    original_price = "199.99"
    is_offer = $true
} | ConvertTo-Json -Depth 10

try {
    $createHandmadeResponse = Invoke-RestMethod -Uri "$baseUrl/api/admin/handmade" -Method POST -Body $handmadeData -Headers $headers
    Write-Host "✅ Handmade product creation successful!" -ForegroundColor Green
    Write-Host "   Message: $($createHandmadeResponse.message)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Handmade product creation failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    exit 1
}

Write-Host "`n🎉 All product creation tests passed!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host "The product creation fix is working correctly." -ForegroundColor Green 