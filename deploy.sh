#!/bin/bash

echo "🚀 Preparando deployment para GitHub Pages..."

# Navegar al directorio client
cd client

echo "📦 Instalando dependencias..."
npm install

echo "🔨 Building proyecto..."
npm run build

echo "📁 Copiando archivos adicionales..."
# Copiar imágenes públicas al dist si es necesario
cp -r public/images dist/ 2>/dev/null || echo "ℹ️  Imágenes ya copiadas"

# Crear archivo .nojekyll en dist para evitar problemas con Jekyll
touch dist/.nojekyll

echo "✅ ¡Deployment preparado!"
echo "📂 Los archivos están en: client/dist/"
echo ""
echo "🌐 Para deployar manualmente ejecuta:"
echo "   cd client && npm run deploy"
echo ""
echo "🔧 O simplemente haz push a main/master para deployment automático"
