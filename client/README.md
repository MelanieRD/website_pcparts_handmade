# CyborgTech - Tienda de Computadoras y Accesorios

Este proyecto es una aplicación React moderna para una tienda especializada en computadoras y accesorios de alta tecnología. Utiliza un sistema de diseño basado en JSON para mantener consistencia visual y facilitar el mantenimiento del código.

## 🚀 Características

- **Sistema de Diseño JSON**: Todas las configuraciones de diseño (colores, tipografía, espaciado, etc.) están centralizadas en un archivo JSON
- **Tienda de Computadoras**: Especializada en productos gaming, accesorios y tecnología de vanguardia
- **Componentes Reutilizables**: Componentes modulares que utilizan el sistema de diseño
- **Diseño Responsivo**: Interfaz adaptativa para diferentes tamaños de pantalla
- **Tipografía Inter**: Fuente moderna y legible
- **Navegación Inteligente**: Menú responsive con soporte móvil

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── Navigation.tsx      # Componente de navegación
│   ├── Navigation.css      # Estilos responsive para navegación
│   └── Button.tsx          # Componente de botón reutilizable
├── pages/
│   └── Home.tsx            # Página principal
├── hooks/
│   └── useDesignSystem.ts  # Hook para acceder al sistema de diseño
├── types/
│   └── json.d.ts           # Declaraciones TypeScript para JSON
├── design-system.json      # Sistema de diseño centralizado
└── ...
```

## 🎨 Sistema de Diseño

El archivo `design-system.json` contiene:

- **Colores**: Paleta completa con variantes (primary, secondary, accent)
- **Tipografía**: Familias de fuentes, tamaños y pesos
- **Espaciado**: Sistema de espaciado consistente
- **Componentes**: Estilos específicos para cada componente
- **Sombras y Bordes**: Configuraciones de efectos visuales

### 🎯 Paleta de Colores Actual

**Colores Principales del Título "Bienvenido a CyborgTech":**

- **Texto principal**: `#1e3a8a` (primary.800) - Azul oscuro
- **Acento "CyborgTech"**: `#c026d3` (accent.600) - Púrpura vibrante

**Paleta Completa:**

- **Primary (Azules)**: `#eff6ff` a `#1e3a8a` (50-900)
- **Secondary (Grises)**: `#f8fafc` a `#0f172a` (50-900)
- **Accent (Púrpuras)**: `#fdf4ff` a `#701a75` (50-900)
- **Semánticos**: Success `#10b981`, Warning `#f59e0b`, Error `#ef4444`

### Ejemplo de uso:

```typescript
import { useDesignSystem } from "../hooks/useDesignSystem";

const MyComponent = () => {
  const { getColor, getTypography, getSpacing } = useDesignSystem();

  return (
    <div
      style={{
        color: getColor("primary.600"),
        fontSize: getTypography("fontSize", "lg"),
        padding: getSpacing("md"),
      }}
    >
      Contenido
    </div>
  );
};
```

## 🛠️ Tecnologías Utilizadas

- **React 18** con TypeScript
- **Vite** como bundler
- **CSS-in-JS** para estilos dinámicos
- **Inter Font** para tipografía
- **JSON** para sistema de diseño

## 🚀 Instalación y Uso

### Prerrequisitos

- Node.js (versión 16 o superior)
- El servidor Rust debe estar ejecutándose (ver [server/README.md](../server/README.md))

### Configuración

1. **Clonar el repositorio**:

   ```bash
   git clone <repository-url>
   cd client
   ```

2. **Configurar variables de entorno**:

   ```bash
   cp env.example .env
   ```

   Edita el archivo `.env` y configura la URL de la API:

   ```env
   VITE_API_URL=http://localhost:3000
   ```

3. **Instalar dependencias**:

   ```bash
   npm install
   ```

4. **Ejecutar en desarrollo**:

   ```bash
   npm run dev
   ```

5. **Construir para producción**:
   ```bash
   npm run build
   ```

### Conectar con el Servidor

El cliente ahora se conecta a un servidor Rust que proporciona los datos de productos. Asegúrate de:

1. **Iniciar el servidor Rust**:

   ```bash
   cd ../server
   cargo run
   ```

2. **Verificar la conexión**: El cliente mostrará un indicador de estado de la API en la esquina superior derecha.

3. **Seed de la base de datos** (si es necesario):
   ```bash
   curl -X POST http://localhost:3000/api/seed
   ```

## 📱 Componentes Disponibles

### Navigation

Componente de navegación responsive con:

- Logo personalizable
- Menú de navegación
- Soporte móvil con hamburger menu
- Estilos basados en el sistema de diseño

```typescript
<Navigation
  logo="Mi Empresa"
  menuItems={[
    { label: "Inicio", href: "/", active: true },
    { label: "Servicios", href: "/servicios" },
  ]}
/>
```

### Button

Componente de botón reutilizable con:

- Variantes: primary, secondary
- Tamaños: sm, md, lg
- Soporte para enlaces y acciones
- Estados: normal, hover, disabled

```typescript
<Button variant="primary" size="lg" href="/contacto">
  Contáctanos
</Button>
```

## 🎯 Ventajas del Sistema de Diseño JSON

1. **Consistencia**: Todos los componentes usan las mismas configuraciones
2. **Mantenibilidad**: Cambios centralizados en un solo archivo
3. **Escalabilidad**: Fácil agregar nuevos componentes y estilos
4. **Reutilización**: Componentes modulares y configurables
5. **Performance**: Estilos optimizados y tipados

## 🔧 Personalización

Para personalizar el diseño, edita el archivo `src/design-system.json`:

```json
{
  "colors": {
    "primary": {
      "500": "#tu-color-principal"
    }
  },
  "typography": {
    "fontSize": {
      "lg": "1.25rem"
    }
  }
}
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

Desarrollado con ❤️ usando React y TypeScript
