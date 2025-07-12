import React, { useState } from "react";
import { useCart } from "./CartContext";

interface Product {
  id: string;
  name: Record<string, string>;
  description: Record<string, string>;
  longDescription?: Record<string, string>;
  price: string;
  originalPrice?: string;
  image: string;
  images?: string[];
  category: string;
  subcategory: string;
  isOffer?: boolean;
  specs?: Record<string, string>;
}

interface ProductDetailsModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  lang?: string;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ open, onClose, product, lang = "es" }) => {
  const { addToCart } = useCart();
  const [imgIdx, setImgIdx] = useState(0);
  if (!open || !product) return null;
  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const handleAdd = () => {
    addToCart({
      id: product.id,
      name: product.name[lang] || product.name["es"],
      price: parseFloat(product.price.replace(/[^0-9.]/g, "")),
      image: product.image,
    });
    onClose();
  };
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };
  const isMobile = window.innerWidth < 900;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.5)",
        zIndex: 3000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: isMobile ? 0 : 24,
        boxSizing: "border-box",
      }}
      onClick={handleOverlayClick}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 24,
          width: "100%",
          maxWidth: "1200px",
          minWidth: 0,
          maxHeight: isMobile ? "100vh" : "95vh",
          overflow: "hidden",
          boxShadow: "0 12px 48px rgba(0,0,0,0.18)",
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header destacado */}
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "center",
            justifyContent: "space-between",
            padding: isMobile ? "20px 16px 10px 16px" : "28px 36px 18px 36px",
            background: "#f7f9fb",
            borderBottom: "1px solid #e1e5e9",
            gap: isMobile ? 8 : 0,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2
              style={{
                fontSize: isMobile ? "1.2rem" : "2rem",
                fontWeight: 800,
                margin: 0,
                color: "#23272f",
                lineHeight: 1.2,
                wordBreak: "break-word",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              {product.name[lang] || product.name["es"]}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              fontSize: 28,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#888",
              padding: 8,
              borderRadius: "50%",
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s",
            }}
            aria-label="Cerrar"
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f3f4")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
          >
            ×
          </button>
        </div>

        {/* Layout principal */}
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            background: "#fafdff",
          }}
        >
          {/* Columna izquierda: Imágenes */}
          <div
            style={{
              flex: isMobile ? "0 0 auto" : "0 0 50%",
              minWidth: 0,
              padding: isMobile ? "18px 18px 0 18px" : "32px 32px 32px 36px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              background: "#f3f6fa",
              borderRight: isMobile ? undefined : "1px solid #e1e5e9",
              borderBottom: isMobile ? "1px solid #e1e5e9" : undefined,
              gap: 18,
            }}
          >
            {/* Imagen principal */}
            <div
              style={{
                width: "100%",
                maxWidth: 420,
                height: isMobile ? 200 : 320,
                borderRadius: 18,
                overflow: "hidden",
                background: "#f8f9fa",
                boxShadow: "0 2px 12px #e1e5e9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 18,
              }}
            >
              <img
                src={images[imgIdx]}
                alt={product.name[lang] || product.name["es"]}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
            {/* Thumbnails */}
            {images.length > 1 && (
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  justifyContent: "center",
                  flexWrap: "wrap",
                  width: "100%",
                }}
              >
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${product.name[lang] || product.name["es"]} - Vista ${i + 1}`}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 10,
                      objectFit: "cover",
                      border: i === imgIdx ? "3px solid #667eea" : "2px solid #e1e5e9",
                      cursor: "pointer",
                      background: "#f8f9fa",
                      transition: "all 0.2s",
                      boxShadow: i === imgIdx ? "0 2px 8px #667eea33" : undefined,
                      outline: i === imgIdx ? "2px solid #667eea" : undefined,
                    }}
                    onClick={() => setImgIdx(i)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Columna derecha: Info y acciones */}
          <div
            style={{
              flex: 1,
              minWidth: 0,
              padding: isMobile ? "18px" : "32px 48px 32px 40px",
              display: "flex",
              flexDirection: "column",
              gap: 18,
              overflowY: "auto",
              maxHeight: isMobile ? 320 : undefined,
            }}
          >
            {/* Precio y oferta */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span
                style={{
                  fontSize: isMobile ? "1.3rem" : "2rem",
                  fontWeight: 800,
                  color: "#667eea",
                  letterSpacing: -1,
                }}
              >
                {product.price}
              </span>
              {product.originalPrice && (
                <span
                  style={{
                    textDecoration: "line-through",
                    color: "#b0b0b0",
                    fontSize: isMobile ? "1rem" : "1.1rem",
                    marginLeft: 6,
                  }}
                >
                  {product.originalPrice}
                </span>
              )}
              {product.isOffer && (
                <span
                  style={{
                    background: "#ff4757",
                    color: "white",
                    padding: "4px 14px",
                    borderRadius: 20,
                    fontSize: isMobile ? "0.9rem" : "1rem",
                    fontWeight: 700,
                    marginLeft: 8,
                    letterSpacing: 0.5,
                  }}
                >
                  OFERTA
                </span>
              )}
            </div>

            {/* Descripción */}
            <div
              style={{
                background: "#f7f9fb",
                borderRadius: 12,
                padding: "14px 18px",
                fontSize: isMobile ? "0.98rem" : "1.08rem",
                color: "#3a4252",
                lineHeight: 1.6,
                maxHeight: isMobile ? 90 : 120,
                overflow: "auto",
                boxShadow: "0 1px 4px #e1e5e9",
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
              }}
            >
              <span style={{ fontWeight: 600, color: "#667eea", fontSize: "1.2em" }}>ℹ️</span>
              <span style={{ wordBreak: "break-word" }}>{product.longDescription?.[lang] || product.longDescription?.["es"] || product.description[lang] || product.description["es"]}</span>
            </div>

            {/* Especificaciones técnicas */}
            {product.specs && (
              <div
                style={{
                  background: "#f3f6fa",
                  borderRadius: 12,
                  padding: 0,
                  overflow: "hidden",
                  boxShadow: "0 1px 4px #e1e5e9",
                }}
              >
                <div
                  style={{
                    background: "#e9eef6",
                    fontWeight: 700,
                    fontSize: isMobile ? "0.98rem" : "1.08rem",
                    padding: "10px 18px",
                    borderBottom: "1px solid #e1e5e9",
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                    color: "#23272f",
                  }}
                >
                  Especificaciones Técnicas
                </div>
                <div
                  style={{
                    maxHeight: isMobile ? 120 : 180,
                    overflowY: "auto",
                  }}
                >
                  {Object.entries(product.specs).map(([key, value], idx) => (
                    <div
                      key={key}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        padding: "10px 18px",
                        background: idx % 2 === 0 ? "#fafdff" : "#f3f6fa",
                        fontSize: isMobile ? "0.95rem" : "1.05rem",
                        borderBottom: "1px solid #e1e5e9",
                        wordBreak: "break-word",
                      }}
                    >
                      <span style={{ fontWeight: 600, color: "#3a4252", flex: "0 0 40%" }}>{key}</span>
                      <span style={{ color: "#4a5568", flex: "0 0 60%", textAlign: "right" }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Botón agregar al carrito */}
            <button
              onClick={handleAdd}
              style={{
                marginTop: 8,
                padding: isMobile ? "13px 0" : "15px 0",
                background: "linear-gradient(90deg, #667eea 0%, #5f72bd 100%)",
                color: "white",
                border: "none",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: isMobile ? "1.08rem" : "1.15rem",
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: "0 2px 8px #667eea33",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                letterSpacing: 0.5,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.18)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px #667eea33";
              }}
            >
              <span role="img" aria-label="carrito">
                🛒
              </span>{" "}
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
