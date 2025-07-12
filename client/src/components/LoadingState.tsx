import React from "react";
import Navigation from "./Navigation";
import Footer from "./Footer";
import { useI18n } from "../hooks/useI18n";

interface LoadingStateProps {
  message?: string;
  showNavigation?: boolean;
  showFooter?: boolean;
  backgroundGradient?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message, showNavigation = true, showFooter = true, backgroundGradient = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }) => {
  const { t } = useI18n();

  const loadingMessage = message || t("common.loading") || "Cargando...";

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      {showNavigation && <Navigation />}
      <main
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "2rem 1rem",
          textAlign: "center",
          background: backgroundGradient,
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: "1.2rem",
            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
          }}
        >
          {loadingMessage}
        </div>
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default LoadingState;
