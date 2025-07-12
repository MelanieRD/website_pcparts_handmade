import React from "react";
import { useDesignSystem } from "../hooks/useDesignSystem";
import { useI18n } from "../hooks/useI18n";
import { useAuth } from "../contexts/AuthContext";
import FooterLogin from "./FooterLogin";

const Footer: React.FC = () => {
  const { getColor, getTypography, getSpacing } = useDesignSystem();
  const { t } = useI18n();
  const { user, isAdmin, logout } = useAuth();

  return (
    <>
      <footer
        style={{
          backgroundColor: getColor("secondary.800"),
          color: getColor("white"),
          padding: `${getSpacing("2xl")} 0`,
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: `0 ${getSpacing("lg")}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <p
              style={{
                fontSize: getTypography("fontSize", "base"),
                color: getColor("secondary.300"),
              }}
            >
              {t("footer.copyright")}
            </p>

            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              {user ? (
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span style={{ fontSize: getTypography("fontSize", "sm"), color: getColor("secondary.300") }}>Hola, {user.name}</span>
                  {isAdmin && (
                    <a
                      href="/admin"
                      style={{
                        fontSize: getTypography("fontSize", "sm"),
                        color: getColor("accent.400"),
                        textDecoration: "none",
                      }}
                    >
                      Panel Admin
                    </a>
                  )}
                  <button
                    onClick={logout}
                    style={{
                      fontSize: getTypography("fontSize", "sm"),
                      color: getColor("accent.400"),
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <FooterLogin />
              )}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
