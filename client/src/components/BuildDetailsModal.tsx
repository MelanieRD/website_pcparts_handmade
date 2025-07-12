import React from "react";
import { useI18n } from "../hooks/useI18n";
import { useCart } from "./CartContext";

interface Build {
  id: string;
  name: Record<string, string>;
  description: Record<string, string>;
  longDescription: Record<string, string>;
  price: string;
  originalPrice?: string;
  mainImage: string;
  images: string[];
  category: string;
  specs: Record<string, string>;
  features: string[];
  isOffer?: boolean;
  isNew?: boolean;
  isPopular?: boolean;
}

interface BuildDetailsModalProps {
  build: Build | null;
  isOpen: boolean;
  onClose: () => void;
}

const BuildDetailsModal: React.FC<BuildDetailsModalProps> = ({ build, isOpen, onClose }) => {
  const { lang, t } = useI18n();
  const { addToCart } = useCart();

  if (!isOpen || !build) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.8)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          maxWidth: "1000px",
          width: "100%",
          maxHeight: "90vh",
          overflow: "auto",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header del modal */}
        <div
          style={{
            padding: "2rem",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "#1f2937" }}>{build.name[lang] || build.name.es}</h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "2rem",
              cursor: "pointer",
              color: "#6b7280",
            }}
          >
            ×
          </button>
        </div>

        {/* Contenido del modal */}
        <div style={{ padding: "2rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
            {/* Columna izquierda - Imágenes */}
            <div>
              <img
                src={build.mainImage}
                alt={build.name[lang] || build.name.es}
                style={{
                  width: "100%",
                  borderRadius: "10px",
                  marginBottom: "1rem",
                }}
              />
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {build.images.slice(1, 4).map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${build.name[lang] || build.name.es} ${index + 2}`}
                    style={{
                      width: "80px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Columna derecha - Información */}
            <div>
              <p style={{ color: "#6b7280", lineHeight: 1.6, marginBottom: "1.5rem" }}>{build.longDescription[lang] || build.longDescription.es}</p>

              {/* Precio */}
              <div style={{ marginBottom: "1.5rem" }}>
                <span style={{ fontSize: "2rem", fontWeight: 700, color: "#667eea" }}>{build.price}</span>
                {build.originalPrice && (
                  <span
                    style={{
                      fontSize: "1.2rem",
                      color: "#9ca3af",
                      textDecoration: "line-through",
                      marginLeft: "0.5rem",
                    }}
                  >
                    {build.originalPrice}
                  </span>
                )}
              </div>

              {/* Especificaciones */}
              <div style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "1rem" }}>{t("ensambles.modal.specs_title") || "Especificaciones"}</h3>
                <div style={{ display: "grid", gap: "0.5rem" }}>
                  {Object.entries(build.specs).map(([key, value]) => (
                    <div key={key} style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontWeight: 600, color: "#374151" }}>{key}:</span>
                      <span style={{ color: "#6b7280" }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Características */}
              <div style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "1rem" }}>{t("ensambles.modal.features_title") || "Características"}</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {build.features.map((feature, index) => (
                    <span
                      key={index}
                      style={{
                        background: "#f3f4f6",
                        color: "#374151",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "15px",
                        fontSize: "0.9rem",
                      }}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Botones */}
              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  onClick={() => {
                    addToCart({
                      id: build.id,
                      name: build.name[lang] || build.name.es,
                      price: parseFloat(build.price.replace(/[^0-9.]/g, "")),
                      image: build.mainImage,
                    });
                    onClose();
                  }}
                  style={{
                    flex: 1,
                    padding: "1rem",
                    background: "#10b981",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "1.1rem",
                  }}
                >
                  🛒 {t("ensambles.modal.add_to_cart") || "Agregar al Carrito"}
                </button>
                <button
                  onClick={onClose}
                  style={{
                    padding: "1rem 2rem",
                    background: "#6b7280",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {t("ensambles.modal.close") || "Cerrar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildDetailsModal;
