import React from "react";

interface ProductCardProps {
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  image: string;
  isOffer?: boolean;
  onAddToCart?: () => void;
  onShowDetails?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, description, price, originalPrice, image, isOffer, onAddToCart, onShowDetails }) => {
  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "16px",
        padding: "1.5rem",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
        border: "1px solid #f1f5f9",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        transition: "all 0.3s ease",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
      }}
      onClick={onShowDetails}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 20px 25px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)";
      }}
    >
      {/* Image Container */}
      <div
        style={{
          position: "relative",
          marginBottom: "1rem",
          borderRadius: "12px",
          overflow: "hidden",
          aspectRatio: "1",
          backgroundColor: "#f8f9fa",
        }}
      >
        {/* Offer Badge */}
        {isOffer && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              backgroundColor: "#e53e3e",
              color: "white",
              padding: "0.25rem 0.5rem",
              borderRadius: "12px",
              fontSize: "0.75rem",
              fontWeight: "600",
              zIndex: "10",
            }}
          >
            OFERTA
          </div>
        )}
        <img
          src={image}
          alt={name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        />

        {/* Quick View Overlay */}
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            background: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: "0",
            transition: "opacity 0.3s ease",
            color: "white",
            fontSize: "0.9rem",
            fontWeight: "600",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "0";
          }}
        >
          Ver Detalles
        </div>
      </div>

      {/* Product Info */}
      <div style={{ flex: "1", display: "flex", flexDirection: "column" }}>
        <h3
          style={{
            fontSize: "1.1rem",
            fontWeight: "600",
            marginBottom: "0.5rem",
            color: "#1e293b",
            lineHeight: "1.4",
          }}
        >
          {name}
        </h3>

        <p
          style={{
            fontSize: "0.9rem",
            marginBottom: "1rem",
            color: "#64748b",
            lineHeight: "1.5",
            flex: "1",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {description.length > 120 ? `${description.substring(0, 120)}...` : description}
        </p>

        {/* Price and Action */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "auto",
          }}
        >
          <div>
            {isOffer && originalPrice && (
              <div
                style={{
                  fontSize: "0.9rem",
                  color: "#999",
                  textDecoration: "line-through",
                  marginBottom: "0.25rem",
                }}
              >
                {originalPrice}
              </div>
            )}
            <div
              style={{
                fontWeight: "700",
                fontSize: "1.25rem",
                color: isOffer ? "#e53e3e" : "#667eea",
              }}
            >
              {price}
            </div>
          </div>

          <button
            style={{
              backgroundColor: "#667eea",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "0.5rem 1rem",
              fontSize: "0.9rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart && onAddToCart();
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#5a67d8";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#667eea";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
