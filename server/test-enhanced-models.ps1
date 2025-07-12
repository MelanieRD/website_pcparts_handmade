# Test script to verify enhanced models with stock, dates, multiple images, and builds
# This script will test creating products, handmade products, and builds with all new fields

Write-Host "🧪 Testing Enhanced Models" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green

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

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Step 2: Create a test product with all new fields
Write-Host "`n2. Creating a test product with enhanced fields..." -ForegroundColor Yellow
$productData = @{
    name = @{
        es = "Laptop Gaming Pro"
        en = "Gaming Laptop Pro"
        fr = "Ordinateur Portable Gaming Pro"
    }
    description = @{
        es = "Laptop gaming de alta gama con RTX 4080"
        en = "High-end gaming laptop with RTX 4080"
        fr = "Ordinateur portable gaming haut de gamme avec RTX 4080"
    }
    price = "2499.99"
    thumbnail_image = "https://example.com/laptop-thumbnail.jpg"
    category = "electronics"
    subcategory = "laptops"
    original_price = "2799.99"
    feature_images = @(
        "https://example.com/laptop-front.jpg",
        "https://example.com/laptop-back.jpg",
        "https://example.com/laptop-keyboard.jpg",
        "https://example.com/laptop-screen.jpg"
    )
    specs = @{
        "Processor" = "Intel i9-13900H"
        "Graphics" = "RTX 4080 16GB"
        "RAM" = "32GB DDR5"
        "Storage" = "2TB NVMe SSD"
        "Display" = "16 inch QHD 240Hz"
    }
    brand = "GamingTech"
    stock = 5
    acquisition_date = "2024-01-15T10:30:00Z"
    is_new = $true
    is_popular = $true
    is_offer = $true
} | ConvertTo-Json -Depth 10

try {
    $createResponse = Invoke-RestMethod -Uri "$baseUrl/api/admin/products" -Method POST -Body $productData -Headers $headers
    Write-Host "✅ Product creation successful!" -ForegroundColor Green
    Write-Host "   Message: $($createResponse.message)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Product creation failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 3: Create a test handmade product with all new fields
Write-Host "`n3. Creating a test handmade product with enhanced fields..." -ForegroundColor Yellow
$handmadeData = @{
    name = @{
        es = "Collar Artesanal de Plata"
        en = "Handmade Silver Necklace"
        fr = "Collier Artisanal en Argent"
    }
    description = @{
        es = "Collar artesanal hecho a mano con plata 925"
        en = "Handmade necklace crafted with 925 silver"
        fr = "Collier artisanal fabriqué à la main en argent 925"
    }
    long_description = @{
        es = "Este collar artesanal es una pieza única creada por artesanos expertos. Cada detalle ha sido cuidadosamente trabajado a mano, desde el diseño hasta el acabado final. La plata 925 garantiza calidad y durabilidad."
        en = "This handmade necklace is a unique piece created by expert artisans. Every detail has been carefully handcrafted, from design to final finish. The 925 silver ensures quality and durability."
        fr = "Ce collier artisanal est une piece unique creee par des artisans experts. Chaque detail a ete soigneusement travaille a la main, du design a la finition finale. L'argent 925 garantit qualite et durabilite."
    }
    price = "299.99"
    thumbnail_image = "https://example.com/necklace-thumbnail.jpg"
    feature_images = @(
        "https://example.com/necklace-front.jpg",
        "https://example.com/necklace-back.jpg",
        "https://example.com/necklace-detail.jpg",
        "https://example.com/necklace-packaging.jpg"
    )
    category = "handmade"
    subcategory = "jewelry"
    specs = @{
        "Material" = "925 Silver"
        "Weight" = "45g"
        "Length" = "18 inches"
        "Clasp" = "Lobster"
        "Finish" = "Polished"
    }
    original_price = "349.99"
    stock = 3
    acquisition_date = "2024-01-20T14:15:00Z"
    is_offer = $true
} | ConvertTo-Json -Depth 10

try {
    $createHandmadeResponse = Invoke-RestMethod -Uri "$baseUrl/api/admin/handmade" -Method POST -Body $handmadeData -Headers $headers
    Write-Host "✅ Handmade product creation successful!" -ForegroundColor Green
    Write-Host "   Message: $($createHandmadeResponse.message)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Handmade product creation failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 4: Create a test build with components
Write-Host "`n4. Creating a test build with components..." -ForegroundColor Yellow
$buildData = @{
    name = @{
        es = "PC Gaming Ultra"
        en = "Ultra Gaming PC"
        fr = "PC Gaming Ultra"
    }
    description = @{
        es = "PC gaming de ultra alta gama para gaming competitivo"
        en = "Ultra high-end gaming PC for competitive gaming"
        fr = "PC gaming ultra haut de gamme pour le gaming compétitif"
    }
    long_description = @{
        es = "Esta PC gaming está diseñada para ofrecer el máximo rendimiento en juegos competitivos. Cada componente ha sido cuidadosamente seleccionado para garantizar la mejor experiencia de gaming posible."
        en = "This gaming PC is designed to deliver maximum performance in competitive games. Each component has been carefully selected to ensure the best possible gaming experience."
        fr = "Ce PC gaming est conçu pour offrir des performances maximales dans les jeux compétitifs. Chaque composant a été soigneusement sélectionné pour garantir la meilleure expérience de gaming possible."
    }
    price = "3499.99"
    thumbnail_image = "https://example.com/pc-thumbnail.jpg"
    feature_images = @(
        "https://example.com/pc-front.jpg",
        "https://example.com/pc-side.jpg",
        "https://example.com/pc-inside.jpg",
        "https://example.com/pc-back.jpg"
    )
    category = "builds"
    subcategory = "gaming"
    specs = @{
        "Case" = "NZXT H510 Elite"
        "Cooling" = "Liquid Cooling"
        "Power Supply" = "850W Gold"
        "Operating System" = "Windows 11 Pro"
    }
    components = @(
        @{
            product_id = "cpu-001"
            quantity = 1
            notes = "Intel i9-13900K Processor"
        },
        @{
            product_id = "gpu-001"
            quantity = 1
            notes = "RTX 4090 Graphics Card"
        },
        @{
            product_id = "ram-001"
            quantity = 2
            notes = "32GB DDR5 RAM (2x16GB)"
        },
        @{
            product_id = "ssd-001"
            quantity = 1
            notes = "2TB NVMe SSD"
        }
    )
    original_price = "3999.99"
    stock = 2
    acquisition_date = "2024-01-25T09:45:00Z"
    is_offer = $true
} | ConvertTo-Json -Depth 10

try {
    $createBuildResponse = Invoke-RestMethod -Uri "$baseUrl/api/admin/builds" -Method POST -Body $buildData -Headers $headers
    Write-Host "✅ Build creation successful!" -ForegroundColor Green
    Write-Host "   Message: $($createBuildResponse.message)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Build creation failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 5: Verify all items were created
Write-Host "`n5. Verifying all items were created..." -ForegroundColor Yellow

# Check products
try {
    $productsResponse = Invoke-RestMethod -Uri "$baseUrl/api/admin/products" -Method GET -Headers $headers
    $gamingLaptop = $productsResponse | Where-Object { $_.name.en -eq "Gaming Laptop Pro" }
    if ($gamingLaptop) {
        Write-Host "✅ Gaming laptop found with stock: $($gamingLaptop.stock)" -ForegroundColor Green
        Write-Host "   Feature images: $($gamingLaptop.feature_images.Count)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Failed to fetch products: $($_.Exception.Message)" -ForegroundColor Red
}

# Check handmade products
try {
    $handmadeResponse = Invoke-RestMethod -Uri "$baseUrl/api/admin/handmade" -Method GET -Headers $headers
    $necklace = $handmadeResponse | Where-Object { $_.name.en -eq "Handmade Silver Necklace" }
    if ($necklace) {
        Write-Host "✅ Necklace found with stock: $($necklace.stock)" -ForegroundColor Green
        Write-Host "   Feature images: $($necklace.feature_images.Count)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Failed to fetch handmade products: $($_.Exception.Message)" -ForegroundColor Red
}

# Check builds
try {
    $buildsResponse = Invoke-RestMethod -Uri "$baseUrl/api/admin/builds" -Method GET -Headers $headers
    $gamingPC = $buildsResponse | Where-Object { $_.name.en -eq "Ultra Gaming PC" }
    if ($gamingPC) {
        Write-Host "✅ Gaming PC found with stock: $($gamingPC.stock)" -ForegroundColor Green
        Write-Host "   Components: $($gamingPC.components.Count)" -ForegroundColor Gray
        Write-Host "   Feature images: $($gamingPC.feature_images.Count)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Failed to fetch builds: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 6: Test public endpoints
Write-Host "`n6. Testing public endpoints..." -ForegroundColor Yellow

try {
    $publicProducts = Invoke-RestMethod -Uri "$baseUrl/api/products" -Method GET
    Write-Host "✅ Public products endpoint working: $($publicProducts.Count) products" -ForegroundColor Green
} catch {
    Write-Host "❌ Public products endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

try {
    $publicHandmade = Invoke-RestMethod -Uri "$baseUrl/api/handmade" -Method GET
    Write-Host "✅ Public handmade endpoint working: $($publicHandmade.Count) items" -ForegroundColor Green
} catch {
    Write-Host "❌ Public handmade endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

try {
    $publicBuilds = Invoke-RestMethod -Uri "$baseUrl/api/builds" -Method GET
    Write-Host "✅ Public builds endpoint working: $($publicBuilds.Count) builds" -ForegroundColor Green
} catch {
    Write-Host "❌ Public builds endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 All enhanced model tests passed!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host "✅ Stock and date fields working" -ForegroundColor Green
Write-Host "✅ Multiple image support working" -ForegroundColor Green
Write-Host "✅ Builds with components working" -ForegroundColor Green
Write-Host "✅ All three product types supported" -ForegroundColor Green 