import React from "react";
import { useI18n } from "../hooks/useI18n";
import { useCart } from "./CartContext";

interface Build {
  id: string;
  name: Record<string, string>;
  description: Record<string, string>;
  longDescription: Record<string, string>;
  price: string;
  thumbnailImage: string;
  featureImages: string[];
  category: string;
  subcategory: string;
  specs: Record<string, string>;
  components: { productId: string; quantity: number; notes?: string }[];
  originalPrice?: string;
  stock?: number;
  acquisitionDate?: string;
  isOffer?: boolean;
  isNew?: boolean;
  isPopular?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface BuildCardProps {
  build: Build;
  onViewDetails: (build: Build) => void;
}

const BuildCard: React.FC<BuildCardProps> = ({ build, onViewDetails }) => {
  const { lang, t } = useI18n();
  const { addToCart } = useCart();

  return (
    <div
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
      onClick={() => onViewDetails(build)}
    >
      {/* Imagen principal */}
      <div
        style={{
          height: "250px",
          background: `linear-gradient(45deg, #667eea, #764ba2)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <img
          src={build.thumbnailImage}
          alt={build.name[lang] || build.name.es}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        {/* Badges */}
        <div
          style={{
            position: "absolute",
            top: "1rem",
            left: "1rem",
            display: "flex",
            gap: "0.5rem",
          }}
        >
          {build.isNew && (
            <span
              style={{
                background: "#10b981",
                color: "white",
                padding: "0.25rem 0.75rem",
                borderRadius: "15px",
                fontSize: "0.8rem",
                fontWeight: 600,
              }}
            >
              {t("ensambles.badges.new") || "Nuevo"}
            </span>
          )}
          {build.isPopular && (
            <span
              style={{
                background: "#f59e0b",
                color: "white",
                padding: "0.25rem 0.75rem",
                borderRadius: "15px",
                fontSize: "0.8rem",
                fontWeight: 600,
              }}
            >
              {t("ensambles.badges.popular") || "Popular"}
            </span>
          )}
          {build.isOffer && (
            <span
              style={{
                background: "#ef4444",
                color: "white",
                padding: "0.25rem 0.75rem",
                borderRadius: "15px",
                fontSize: "0.8rem",
                fontWeight: 600,
              }}
            >
              {t("ensambles.badges.offer") || "Oferta"}
            </span>
          )}
        </div>
      </div>

      {/* Información del ensamble */}
      <div style={{ padding: "1.5rem" }}>
        <h3
          style={{
            fontSize: "1.3rem",
            fontWeight: 700,
            color: "#1f2937",
            marginBottom: "0.5rem",
          }}
        >
          {build.name[lang] || build.name.es}
        </h3>
        <p
          style={{
            color: "#6b7280",
            lineHeight: 1.5,
            marginBottom: "1rem",
          }}
        >
          {build.description[lang] || build.description.es}
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
            {build.price}
          </span>
          {build.originalPrice && (
            <span
              style={{
                fontSize: "1rem",
                color: "#9ca3af",
                textDecoration: "line-through",
                marginLeft: "0.5rem",
              }}
            >
              {build.originalPrice}
            </span>
          )}
        </div>

        {/* Botones */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(build);
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
            {t("ensambles.actions.view_details") || "Ver Detalles"}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart({
                id: build.id,
                name: build.name[lang] || build.name.es,
                price: parseFloat(build.price.replace(/[^0-9.]/g, "")),
                image: build.thumbnailImage,
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
  );
};

export default BuildCard;
