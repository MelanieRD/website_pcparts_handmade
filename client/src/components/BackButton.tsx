import React from "react";
import { useI18n } from "../hooks/useI18n";

interface BackButtonProps {
  onClick: () => void;
  text?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick, text }) => {
  const { t } = useI18n();

  const buttonText = text || t("details.back") || "Volver";

  return (
    <button
      onClick={onClick}
      style={{
        marginBottom: 24,
        padding: "0.5rem 1rem",
        background: "#667eea",
        color: "white",
        border: "none",
        borderRadius: 8,
        cursor: "pointer",
        fontSize: "1rem",
        transition: "background 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#5a67d8")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "#667eea")}
    >
      &larr; {buttonText}
    </button>
  );
};

export default BackButton;
