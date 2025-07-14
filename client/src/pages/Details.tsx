import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useI18n } from "../hooks/useI18n";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import LoadingState from "../components/LoadingState";
import BackButton from "../components/BackButton";
import type { Product } from "../services/api";
import { apiService } from "../services/api";

const Details: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { lang, t, loading: i18nLoading } = useI18n();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      
      try {
        const result = await apiService.getProductById(id);
        setProduct(result);
      } catch (error) {
        console.error("Error loading product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    
    loadProduct();
  }, [id]);

  if (i18nLoading || loading) {
    return <LoadingState message={t("common.loading") || "Cargando..."} />;
  }

  if (!product) {
    return (
      <div style={{ fontFamily: "Inter, system-ui, sans-serif", textAlign: "center", padding: "2rem" }}>
        <Navigation />
        <div>{t("details.not_found") || "Producto no encontrado"}</div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <Navigation />
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}>
        <BackButton onClick={() => navigate(-1)} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
                          <img src={product.thumbnailImage} alt={product.name[lang] || product.name["es"]} style={{ maxWidth: 320, borderRadius: 16, background: "#f8f9fa" }} />
          <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>{product.name[lang] || product.name["es"]}</h1>
          <p style={{ fontSize: "1.1rem", color: "#555", marginBottom: 16 }}>{product.description[lang] || product.description["es"]}</p>
          <div style={{ fontSize: "1.5rem", fontWeight: 600, color: "#667eea" }}>{product.price}</div>
          {product.originalPrice && <div style={{ textDecoration: "line-through", color: "#999" }}>{product.originalPrice}</div>}
          <button
            style={{
              marginTop: 24,
              padding: "0.75rem 2rem",
              background: "#667eea",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: "1.1rem",
              cursor: "pointer",
            }}
          >
            {t("details.add_to_cart") || "Agregar al carrito"}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Details;
