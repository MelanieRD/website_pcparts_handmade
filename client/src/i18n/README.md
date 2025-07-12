# Sistema de Internacionalización (i18n) - CyborgTech

Este documento explica cómo usar correctamente el sistema de internacionalización en la aplicación CyborgTech.

## Estructura de archivos

```
src/i18n/
├── es.json      # Traducciones en español
├── en.json      # Traducciones en inglés
├── fr.json      # Traducciones en francés
└── README.md    # Este archivo
```

## Cómo usar el sistema i18n

### 1. Importar el hook useI18n

```tsx
import { useI18n } from "../hooks/useI18n";

const MyComponent: React.FC = () => {
  const { lang, t, loading, setLang } = useI18n();
  // ...
};
```

### 2. Manejar el estado de carga

**IMPORTANTE**: Siempre verificar si las traducciones están cargando antes de mostrar contenido.

```tsx
const { lang, t, loading } = useI18n();

// ❌ MAL: No verificar el estado de carga
return <div>{t("some.key")}</div>;

// ✅ BIEN: Verificar el estado de carga
if (loading) {
  return <div>Cargando traducciones...</div>;
}

return <div>{t("some.key")}</div>;
```

### 3. Usar traducciones

```tsx
// Traducción simple
const title = t("navbar.home");

// Traducción con fallback
const description = t("handmade.loading") || "Cargando...";

// Traducción anidada
const filterName = t("products.filters.processor");
```

### 4. Cambiar idioma

```tsx
const { setLang } = useI18n();

const handleLanguageChange = (newLang: "es" | "en" | "fr") => {
  setLang(newLang);
};
```

## Estructura de claves de traducción

### Organización recomendada

```json
{
  "navbar": {
    "home": "Inicio",
    "products": "Productos"
  },
  "products": {
    "title": "Nuestros Productos",
    "filters": {
      "all": "Todos",
      "processor": "Procesadores"
    }
  },
  "handmade": {
    "loading": "Cargando productos handmade...",
    "title": "Productos Handmade",
    "categories": {
      "keycaps": "Keycaps",
      "mousepads": "Mousepads"
    }
  }
}
```

### Convenciones de nomenclatura

- **Usar claves descriptivas**: `"products.filters.processor"` en lugar de `"p1"`
- **Organizar por secciones**: Agrupar traducciones relacionadas
- **Usar camelCase para claves**: `"productDetails"` en lugar de `"product-details"`
- **Mantener consistencia**: Usar las mismas claves en todos los idiomas

## Ejemplo completo de componente

```tsx
import React from "react";
import { useI18n } from "../hooks/useI18n";

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { lang, t, loading } = useI18n();

  // Manejar estado de carga
  if (loading) {
    return <div style={{ padding: "1rem", textAlign: "center" }}>{t("common.loading") || "Cargando..."}</div>;
  }

  return (
    <div>
      <h3>{product.name[lang] || product.name.es}</h3>
      <p>{product.description[lang] || product.description.es}</p>
      <button>{t("products.addToCart")}</button>
    </div>
  );
};
```

## Manejo de errores

### Claves que no existen

Si una clave no existe, el sistema devuelve la clave misma:

```tsx
const text = t("key.that.does.not.exist");
// Resultado: "key.that.does.not.exist"
```

### Fallbacks recomendados

```tsx
// ✅ Usar fallbacks para texto crítico
const title = t("handmade.title") || "Productos Handmade";

// ✅ Usar fallbacks para claves que podrían no existir
const description = t("handmade.subtitle") || "Descripción por defecto";
```

## Agregar nuevas traducciones

### 1. Agregar la clave en todos los archivos de idioma

**es.json:**

```json
{
  "newSection": {
    "title": "Nuevo Título",
    "description": "Nueva descripción"
  }
}
```

**en.json:**

```json
{
  "newSection": {
    "title": "New Title",
    "description": "New description"
  }
}
```

**fr.json:**

```json
{
  "newSection": {
    "title": "Nouveau Titre",
    "description": "Nouvelle description"
  }
}
```

### 2. Usar en el componente

```tsx
const { t } = useI18n();

return (
  <div>
    <h1>{t("newSection.title")}</h1>
    <p>{t("newSection.description")}</p>
  </div>
);
```

## Mejores prácticas

1. **Siempre verificar loading**: No mostrar contenido antes de que las traducciones estén listas
2. **Usar fallbacks**: Proporcionar texto por defecto para claves críticas
3. **Organizar claves**: Agrupar traducciones relacionadas en secciones lógicas
4. **Mantener consistencia**: Usar las mismas claves en todos los idiomas
5. **Usar claves descriptivas**: Evitar claves genéricas como "text1", "text2"
6. **Probar todos los idiomas**: Verificar que las traducciones funcionen en todos los idiomas soportados

## Solución de problemas

### Error: "Translation not found for key"

Este warning aparece cuando una clave no existe. Soluciones:

1. **Agregar la clave faltante** en los archivos de traducción
2. **Usar un fallback** para claves opcionales
3. **Verificar la ortografía** de la clave

### Error: "useI18n must be used within I18nProvider"

Asegúrate de que el componente esté envuelto en el `I18nProvider` en el árbol de componentes.

### Problemas de carga

Si las traducciones no cargan:

1. **Verificar la ruta** de los archivos JSON
2. **Verificar la sintaxis** JSON (comas, llaves, etc.)
3. **Verificar que el archivo existe** en la ruta especificada

## Componente de ejemplo

Ver `src/components/I18nExample.tsx` para un ejemplo completo de uso del sistema i18n.
