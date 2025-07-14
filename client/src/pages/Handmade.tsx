// Muestra productos handmade reales como keycaps, mousepads, wrist rests, etc. Usa la API del servidor.
import React, { useState } from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import ProductDetailsModal from "../components/ProductDetailsModal";
import HeroSection from "../components/HeroSection";
import InfoSection from "../components/InfoSection";
import LoadingState from "../components/LoadingState";
import { useI18n } from "../hooks/useI18n";
import { useCart } from "../components/CartContext";
import { useHandmade } from "../hooks/useApi";
import type { HandmadeProduct } from "../services/api";

const Handmade: React.FC = () => {
  const { data: products, loading, error } = useHandmade();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<HandmadeProduct | null>(null);
  const { lang, t, loading: i18nLoading } = useI18n();
  const { addToCart } = useCart();

  // Mostrar loading mientras se cargan las traducciones o productos
  if (i18nLoading || loading) {
    return <LoadingState message={t("handmade.loading") || "Cargando productos handmade..."} />;
  }

  if (error) {
    return (
      <div>
        <Navigation />
        <main style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1rem", textAlign: "center" }}>
          <div style={{ color: "red" }}>Error: {error}</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!products) {
    return (
      <div>
        <Navigation />
        <main style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1rem", textAlign: "center" }}>
          <div>No se encontraron productos handmade.</div>
        </main>
        <Footer />
      </div>
    );
  }

  const categories = [
    { icon: "🎨", key: "handmade.categories.keycaps" },
    { icon: "🖱️", key: "handmade.categories.mousepads" },
    { icon: "⌨️", key: "handmade.categories.wrist_rests" },
    { icon: "🔌", key: "handmade.categories.cables" },
    { icon: "💡", key: "handmade.categories.rgb" },
    { icon: "🎧", key: "handmade.categories.stands" },
  ];

  const infoItems = [
    {
      icon: "✨",
      title: t("handmade.why_choose.unique.title") || "Únicos",
      description: t("handmade.why_choose.unique.description") || "Cada pieza es única y personalizada según tus preferencias",
    },
    {
      icon: "🏆",
      title: t("handmade.why_choose.quality.title") || "Calidad",
      description: t("handmade.why_choose.quality.description") || "Hechos a mano con materiales premium y atención al detalle",
    },
    {
      icon: "🎨",
      title: t("handmade.why_choose.customization.title") || "Personalización",
      description: t("handmade.why_choose.customization.description") || "Diseños completamente personalizables para tu setup",
    },
  ];

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <Navigation />

      <HeroSection
        title={t("handmade.title") || "Productos Handmade"}
        subtitle={t("handmade.subtitle") || "Descubre productos únicos y personalizados hechos a mano para tu setup. Cada pieza es una obra de arte creada con pasión y dedicación."}
        categories={categories}
        titleIcon="✨"
      />

      {/* Contenido principal */}
      <main
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "3rem 2rem",
          background: "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)",
        }}
      >
        {/* Grid de productos con diseño mejorado */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
            marginTop: "2rem",
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                background: "white",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                transition: "transform 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
              onClick={() => {
                setSelectedProduct(product);
                setDetailsOpen(true);
              }}
            >
              {/* Imagen principal con gradiente de fondo */}
              <div
                style={{
                  height: "250px",
                  background: "linear-gradient(45deg, #667eea, #764ba2)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <img
                  src={product.thumbnailImage}
                  alt={product.name[lang] || product.name.es}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                {/* Badge de oferta si aplica */}
                {product.isOffer && (
                  <div
                    style={{
                      position: "absolute",
                      top: "1rem",
                      right: "1rem",
                      background: "#ef4444",
                      color: "white",
                      padding: "0.5rem 1rem",
                      borderRadius: "20px",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                    }}
                  >
                    {t("products.offers") || "Oferta"}
                  </div>
                )}
              </div>

              {/* Información del producto */}
              <div style={{ padding: "1.5rem" }}>
                <h3
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: 700,
                    color: "#1f2937",
                    marginBottom: "0.5rem",
                  }}
                >
                  {product.name[lang] || product.name.es}
                </h3>
                <p
                  style={{
                    color: "#6b7280",
                    lineHeight: 1.5,
                    marginBottom: "1rem",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {product.description[lang] || product.description.es}
                </p>

                {/* Precio */}
                <div style={{ marginBottom: "1rem" }}>
                  <span
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: "#667eea",
                    }}
                  >
                    {product.price}
                  </span>
                  {product.originalPrice && (
                    <span
                      style={{
                        fontSize: "1rem",
                        color: "#9ca3af",
                        textDecoration: "line-through",
                        marginLeft: "0.5rem",
                      }}
                    >
                      {product.originalPrice}
                    </span>
                  )}
                </div>

                {/* Botones */}
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProduct(product);
                      setDetailsOpen(true);
                    }}
                    style={{
                      flex: 1,
                      padding: "0.75rem",
                      background: "#667eea",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#5a67d8")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#667eea")}
                  >
                    {t("products.view_details") || "Ver Detalles"}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart({
                        id: product.id,
                        name: product.name[lang] || product.name.es,
                        price: parseFloat(product.price.replace(/[^0-9.]/g, "")),
                        image: product.thumbnailImage,
                      });
                    }}
                    style={{
                      padding: "0.75rem 1rem",
                      background: "#10b981",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#059669")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#10b981")}
                  >
                    🛒
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <InfoSection title={t("handmade.why_choose.title") || "¿Por qué elegir productos handmade?"} items={infoItems} titleIcon="✨" />
      </main>

      {/* Modal de detalles del producto */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          open={detailsOpen}
          onClose={() => {
            setDetailsOpen(false);
            setSelectedProduct(null);
          }}
        />
      )}

      <Footer />
    </div>
  );
};

export default Handmade;
