#!/bin/bash

# CyborgTech API Test Script

BASE_URL="http://localhost:3000"

echo "🧪 Testing CyborgTech API..."

# Test health endpoint
echo "📊 Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s "$BASE_URL/api/health")
if [ $? -eq 0 ]; then
    echo "✅ Health check passed"
    echo "   Response: $HEALTH_RESPONSE"
else
    echo "❌ Health check failed"
    exit 1
fi

echo ""

# Test products endpoint
echo "📦 Testing products endpoint..."
PRODUCTS_RESPONSE=$(curl -s "$BASE_URL/api/products")
if [ $? -eq 0 ]; then
    PRODUCT_COUNT=$(echo "$PRODUCTS_RESPONSE" | jq '. | length' 2>/dev/null || echo "unknown")
    echo "✅ Products endpoint working"
    echo "   Found $PRODUCT_COUNT products"
else
    echo "❌ Products endpoint failed"
fi

echo ""

# Test handmade endpoint
echo "🎨 Testing handmade endpoint..."
HANDMADE_RESPONSE=$(curl -s "$BASE_URL/api/handmade")
if [ $? -eq 0 ]; then
    HANDMADE_COUNT=$(echo "$HANDMADE_RESPONSE" | jq '. | length' 2>/dev/null || echo "unknown")
    echo "✅ Handmade endpoint working"
    echo "   Found $HANDMADE_COUNT handmade products"
else
    echo "❌ Handmade endpoint failed"
fi

echo ""

# Test specific product by ID
echo "🔍 Testing product by ID..."
PRODUCT_ID="1"
PRODUCT_BY_ID_RESPONSE=$(curl -s "$BASE_URL/api/products/$PRODUCT_ID")
if [ $? -eq 0 ]; then
    PRODUCT_NAME=$(echo "$PRODUCT_BY_ID_RESPONSE" | jq -r '.name.en' 2>/dev/null || echo "unknown")
    echo "✅ Product by ID working"
    echo "   Product $PRODUCT_ID: $PRODUCT_NAME"
else
    echo "❌ Product by ID failed"
fi

echo ""

# Test category filtering
echo "🏷️  Testing category filtering..."
CATEGORY="gaming"
CATEGORY_RESPONSE=$(curl -s "$BASE_URL/api/products/category/$CATEGORY")
if [ $? -eq 0 ]; then
    CATEGORY_COUNT=$(echo "$CATEGORY_RESPONSE" | jq '. | length' 2>/dev/null || echo "unknown")
    echo "✅ Category filtering working"
    echo "   Found $CATEGORY_COUNT products in category '$CATEGORY'"
else
    echo "❌ Category filtering failed"
fi

echo ""
echo "🎉 API testing complete!"
echo ""
echo "If you need to seed the database, run:"
echo "curl -X POST $BASE_URL/api/seed" 