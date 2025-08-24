# 🚀 Guía de Deployment - CyborgTech Store

## ✅ Todo está listo para GitHub Pages

### 📋 Checklist Pre-Deployment

- [x] Configuración de Vite actualizada para GitHub Pages
- [x] GitHub Actions workflow creado
- [x] Package.json configurado con gh-pages
- [x] Archivo .nojekyll creado
- [x] Botones del carrito arreglados (colores más oscuros)
- [x] Scripts de deployment preparados

## 🌐 Activar GitHub Pages

### Paso 1: Subir código a GitHub
```bash
git add .
git commit -m "✨ Configurar proyecto para GitHub Pages"
git push origin main
```

### Paso 2: Configurar GitHub Pages
1. Ve a tu repositorio en GitHub
2. Click en **Settings** → **Pages**  
3. En **Source** selecciona: **"GitHub Actions"**
4. ¡Listo! Se desplegará automáticamente

## 🔧 Configuraciones Importantes

### Cambiar nombre del repositorio
El repositorio está configurado para "website_pcparts_handmade". Si cambias el nombre, edita:
```typescript
// client/vite.config.ts línea 8
base: process.env.NODE_ENV === 'production' ? '/website_pcparts_handmade/' : '/',
```

### Configurar WhatsApp
Edita el número de WhatsApp en:
```javascript
// client/src/components/Header.tsx línea 256
const whatsappNumber = '1234567890'; // Cambia por tu número real
```

## 🚀 Métodos de Deployment

### Método 1: Automático (Recomendado)
- Push a `main`/`master` → Deploy automático
- URL: `https://MelanieRD.github.io/website_pcparts_handmade/`

### Método 2: Manual con script
```bash
./deploy.sh
```

### Método 3: Manual paso a paso  
```bash
cd client
npm install
npm run build
npm run deploy
```

## 📱 Funcionalidades Listas

### 🛒 Carrito Mejorado
- ✅ Botones +/- ahora son visibles (fondo gris)
- ✅ Editar cantidades con input directo
- ✅ Eliminar productos individuales
- ✅ Vaciar carrito completo
- ✅ Checkout por WhatsApp

### 🎨 UI Optimizada
- ✅ Cards de productos más compactas
- ✅ Hero banner con animaciones
- ✅ Filtros responsive (se ocultan en móvil)
- ✅ Paginación siempre visible
- ✅ Colores mejorados para legibilidad

## 🔍 Verificar Deployment

1. **Build local**: `cd client && npm run build`
2. **Preview**: `cd client && npm run preview` 
3. **Test online**: Esperar ~5 minutos después del push

## 🆘 Troubleshooting

### Problemas comunes:

**❌ Páginas en blanco**
- Verificar `base` path en vite.config.ts
- Comprobar que GitHub Pages esté en "GitHub Actions"

**❌ Imágenes no cargan**
- Las imágenes deben estar en `client/public/images/`
- Usar rutas relativas: `/images/logo.png`

**❌ Carrito no funciona**
- Verificar que no hay errores en consola
- Los botones ahora son grises y visibles

**❌ WhatsApp no funciona**  
- Cambiar número en Header.tsx
- Formato: solo números, sin + ni espacios

## 🎉 ¡Tu tienda está lista!

Una vez configurado, tendrás:
- ✨ Tienda online profesional
- 📱 100% responsive
- 🛒 Carrito completamente funcional
- 💬 Ventas directas por WhatsApp
- 🚀 Deploy automático en cada update

---

**💡 Tip**: Cada vez que hagas cambios, simplemente haz `git push` y se actualizará automáticamente.
