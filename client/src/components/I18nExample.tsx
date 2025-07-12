import React from "react";
import { useI18n } from "../hooks/useI18n";

/**
 * Componente de ejemplo que demuestra el uso correcto del sistema de i18n
 * con manejo de tiempo de carga y fallbacks
 */
const I18nExample: React.FC = () => {
  const { lang, t, loading, setLang } = useI18n();

  // Si las traducciones están cargando, mostrar un loading
  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div style={{ fontSize: "1.2rem", color: "#666" }}>Cargando traducciones...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Ejemplo de uso del sistema i18n</h2>

      {/* Selector de idioma */}
      <div style={{ marginBottom: "2rem" }}>
        <h3>Selector de idioma:</h3>
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <button
            onClick={() => setLang("es")}
            style={{
              padding: "0.5rem 1rem",
              background: lang === "es" ? "#007bff" : "#f8f9fa",
              color: lang === "es" ? "white" : "#333",
              border: "1px solid #ddd",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Español
          </button>
          <button
            onClick={() => setLang("en")}
            style={{
              padding: "0.5rem 1rem",
              background: lang === "en" ? "#007bff" : "#f8f9fa",
              color: lang === "en" ? "white" : "#333",
              border: "1px solid #ddd",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            English
          </button>
          <button
            onClick={() => setLang("fr")}
            style={{
              padding: "0.5rem 1rem",
              background: lang === "fr" ? "#007bff" : "#f8f9fa",
              color: lang === "fr" ? "white" : "#333",
              border: "1px solid #ddd",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Français
          </button>
        </div>
      </div>

      {/* Ejemplos de uso */}
      <div style={{ marginBottom: "2rem" }}>
        <h3>Ejemplos de traducciones:</h3>

        <div
          style={{
            background: "#f8f9fa",
            padding: "1rem",
            borderRadius: "8px",
            marginTop: "1rem",
          }}
        >
          <h4>Texto simple:</h4>
          <p>
            <strong>Clave:</strong> "navbar.home"
          </p>
          <p>
            <strong>Traducción:</strong> {t("navbar.home")}
          </p>
        </div>

        <div
          style={{
            background: "#f8f9fa",
            padding: "1rem",
            borderRadius: "8px",
            marginTop: "1rem",
          }}
        >
          <h4>Texto anidado:</h4>
          <p>
            <strong>Clave:</strong> "products.filters.all"
          </p>
          <p>
            <strong>Traducción:</strong> {t("products.filters.all")}
          </p>
        </div>

        <div
          style={{
            background: "#f8f9fa",
            padding: "1rem",
            borderRadius: "8px",
            marginTop: "1rem",
          }}
        >
          <h4>Texto con fallback:</h4>
          <p>
            <strong>Clave:</strong> "handmade.loading"
          </p>
          <p>
            <strong>Traducción:</strong> {t("handmade.loading")}
          </p>
        </div>

        <div
          style={{
            background: "#f8f9fa",
            padding: "1rem",
            borderRadius: "8px",
            marginTop: "1rem",
          }}
        >
          <h4>Clave que no existe (muestra la clave):</h4>
          <p>
            <strong>Clave:</strong> "texto.que.no.existe"
          </p>
          <p>
            <strong>Resultado:</strong> {t("texto.que.no.existe")}
          </p>
        </div>
      </div>

      {/* Información del estado */}
      <div
        style={{
          background: "#e9ecef",
          padding: "1rem",
          borderRadius: "8px",
          marginTop: "2rem",
        }}
      >
        <h3>Información del estado:</h3>
        <p>
          <strong>Idioma actual:</strong> {lang}
        </p>
        <p>
          <strong>Estado de carga:</strong> {loading ? "Cargando..." : "Completado"}
        </p>
      </div>

      {/* Mejores prácticas */}
      <div
        style={{
          background: "#d4edda",
          padding: "1rem",
          borderRadius: "8px",
          marginTop: "2rem",
        }}
      >
        <h3>Mejores prácticas:</h3>
        <ul>
          <li>
            <strong>Usar claves descriptivas:</strong> "products.filters.processor" en lugar de "p1"
          </li>
          <li>
            <strong>Proporcionar fallbacks:</strong> {t("handmade.loading") || "Cargando..."}
          </li>
          <li>
            <strong>Manejar el estado de carga:</strong> Verificar si loading es true antes de mostrar contenido
          </li>
          <li>
            <strong>Usar claves anidadas:</strong> Organizar traducciones en categorías lógicas
          </li>
          <li>
            <strong>Mantener consistencia:</strong> Usar las mismas claves en todos los idiomas
          </li>
        </ul>
      </div>
    </div>
  );
};

export default I18nExample;
