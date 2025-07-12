# Configuración de Cloudinary para Subida de Imágenes

## ¿Qué es Cloudinary?

Cloudinary es un servicio de gestión de medios en la nube que permite subir, almacenar y optimizar imágenes de forma gratuita.

## Pasos para Configurar Cloudinary

### 1. Crear Cuenta

1. Ve a [https://cloudinary.com](https://cloudinary.com)
2. Haz clic en "Sign Up For Free"
3. Completa el registro con tu email y contraseña

### 2. Obtener Cloud Name

1. Una vez registrado, ve a tu **Dashboard**
2. En la parte superior verás tu **Cloud Name** (ejemplo: `d123456789`)
3. Copia este valor

### 3. Crear Upload Preset

1. En el Dashboard, ve a **Settings** > **Upload**
2. Baja hasta la sección **Upload presets**
3. Haz clic en **Add upload preset**
4. Configura:
   - **Preset name**: `cyborgtech_uploads` (o el nombre que prefieras)
   - **Signing Mode**: Selecciona **Unsigned**
   - **Folder**: `cyborgtech/products` (opcional, para organizar)
5. Haz clic en **Save**

### 4. Configurar Variables de Entorno

1. En el directorio `client/`, crea un archivo `.env` (si no existe)
2. Agrega las siguientes variables:

```env
VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name_aqui
VITE_CLOUDINARY_UPLOAD_PRESET=cyborgtech_uploads
```

### 5. Ejemplo de Configuración

```env
# API Configuration
VITE_API_URL=http://localhost:3001

# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=d123456789
VITE_CLOUDINARY_UPLOAD_PRESET=cyborgtech_uploads
```

## Cómo Funciona

1. **Usuario selecciona imagen**: En el formulario de productos
2. **Frontend sube a Cloudinary**: Automáticamente usando la API
3. **Cloudinary responde con URL**: Una URL pública de la imagen
4. **Se guarda solo la URL**: En MongoDB, no el archivo

## Ventajas

- ✅ **Gratis**: 25GB de almacenamiento y 25GB de ancho de banda mensual
- ✅ **Optimización automática**: Cloudinary optimiza las imágenes
- ✅ **CDN global**: Imágenes se sirven desde servidores cercanos
- ✅ **Transformaciones**: Puedes redimensionar, recortar, etc. via URL
- ✅ **Seguro**: Solo URLs públicas, no archivos sensibles

## Límites Gratuitos

- **Almacenamiento**: 25GB
- **Ancho de banda**: 25GB/mes
- **Transformaciones**: 25,000/mes
- **Subidas**: 25,000/mes

## Solución de Problemas

### Error: "Upload preset not found"

- Verifica que el preset esté configurado como **Unsigned**
- Asegúrate de que el nombre del preset coincida exactamente

### Error: "Cloud name not found"

- Verifica que el cloud name esté correcto
- No incluyas espacios o caracteres especiales

### Error: "CORS policy"

- Cloudinary maneja CORS automáticamente
- Si persiste, verifica que estés usando HTTPS en producción

## URLs de Ejemplo

Una vez configurado, las URLs se verán así:

```
https://res.cloudinary.com/d123456789/image/upload/v1234567890/cyborgtech/products/imagen.jpg
```

## Transformaciones Adicionales

Puedes agregar transformaciones a las URLs:

- Redimensionar: `w_300,h_200`
- Calidad: `q_80`
- Formato: `f_auto`

Ejemplo:

```
https://res.cloudinary.com/d123456789/image/upload/w_300,h_200,q_80/cyborgtech/products/imagen.jpg
```
