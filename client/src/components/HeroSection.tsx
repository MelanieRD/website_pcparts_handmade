import React from "react";
import { useI18n } from "../hooks/useI18n";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  categories?: Array<{ icon: string; key: string }>;
  backgroundGradient?: string;
  titleIcon?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ title, subtitle, categories = [], backgroundGradient = "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)", titleIcon = "" }) => {
  const { t } = useI18n();

  return (
    <section
      style={{
        background: backgroundGradient,
        padding: "4rem 2rem",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Elementos decorativos */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="40" r="1.5" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="80" r="1" fill="rgba(255,255,255,0.1)"/></svg>\')',
          opacity: 0.3,
        }}
      />

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <h1
          style={{
            fontSize: "3.5rem",
            fontWeight: 800,
            marginBottom: "1rem",
            color: "white",
            textShadow: "0 4px 8px rgba(0,0,0,0.3)",
            background: "linear-gradient(45deg, #fff, #f0f0f0)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {titleIcon} {title}
        </h1>
        <p
          style={{
            fontSize: "1.3rem",
            color: "rgba(255,255,255,0.9)",
            marginBottom: "2rem",
            maxWidth: "700px",
            marginLeft: "auto",
            marginRight: "auto",
            lineHeight: 1.6,
            textShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          {subtitle}
        </p>

        {/* Badges de categorías */}
        {categories.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: "2rem",
            }}
          >
            {categories.map((cat, i) => (
              <span
                key={i}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  color: "white",
                  padding: "0.5rem 1rem",
                  borderRadius: "25px",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.3)",
                }}
              >
                {cat.icon} {t(cat.key) || cat.key.split(".").pop()}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
