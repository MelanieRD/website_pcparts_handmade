# CyborgTech Store 🚀

Una moderna tienda online especializada en componentes de computadora y productos artesanales únicos.

## ✨ Características

- **🛒 Carrito de compras completo** - Añadir, editar cantidades y eliminar productos
- **📱 Diseño responsive** - Funciona perfectamente en móvil, tablet y desktop
- **🔍 Búsqueda avanzada** - Encuentra productos por nombre, descripción o categoría
- **📄 Paginación inteligente** - Navegación fluida entre productos
- **💬 Integración WhatsApp** - Checkout directo por WhatsApp
- **🎨 UI Moderna** - Diseño elegante con Tailwind CSS
- **⚡ Performance optimizada** - Carga rápida con Vite

## 🛍️ Funcionalidades del Carrito

- **Editar cantidades**: Botones +/- o input directo
- **Eliminar productos**: Botón de eliminar individual
- **Vaciar carrito**: Limpiar todo el carrito con confirmación
- **Total automático**: Cálculo en tiempo real
- **Checkout WhatsApp**: Envío automático de pedido

## 🔧 Tecnologías

- **React 18** + TypeScript
- **Tailwind CSS** para styling
- **Lucide React** para iconos
- **Vite** para build y desarrollo
- **GitHub Pages** para deployment

## 🚀 Deployment

### Opción 1: GitHub Actions (Automático)
El proyecto está configurado para deployment automático. Solo necesitas:

1. **Activar GitHub Pages** en tu repositorio:
   - Ve a Settings → Pages
   - Source: "GitHub Actions"

2. **Push a main/master** - Se desplegará automáticamente

### Opción 2: Manual con gh-pages
```bash
cd client
npm install
npm run deploy
```

## ⚙️ Configuración

### Cambiar nombre del repositorio
Si tu repositorio no se llama "CyborgTech", actualiza en `client/vite.config.ts`:
```typescript
base: process.env.NODE_ENV === 'production' ? '/TU-REPO-NOMBRE/' : '/',
```

### Configurar WhatsApp
En `client/src/components/Header.tsx`, cambia:
```javascript
const whatsappNumber = '1234567890'; // Tu número real
```

## 🎯 Demo

Visita: `https://MelanieRD.github.io/website_pcparts_handmade/`

## 💻 Desarrollo Local

```bash
cd client
npm install
npm run dev
```

Abre http://localhost:5173

## 🌟 Características Destacadas

- **Hero animado** con componentes de PC flotantes
- **Cards de productos** compactas y responsivas  
- **Filtros responsivos** que se ocultan en móvil
- **Colores optimizados** para máxima legibilidad
- **Paginación visible** siempre informativa
- **WhatsApp integration** para ventas directas

¡Hecho con ❤️ para la comunidad tech!
