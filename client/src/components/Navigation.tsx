import React, { useState } from "react";
import { useDesignSystem } from "../hooks/useDesignSystem";
import { useI18n } from "../hooks/useI18n";
import type { SupportedLang } from "../hooks/useI18n";
import { useCart } from "./CartContext";
import CartDrawer from "./CartDrawer";
import "./Navigation.css";
import { Link, useLocation } from "react-router-dom";

const LANGS: { code: SupportedLang; label: string }[] = [
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
];

const Navigation: React.FC = () => {
  const { getComponentStyle, getColor, getTypography, getSpacing } = useDesignSystem();
  const { t, lang, setLang, loading } = useI18n();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { cart } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const location = useLocation();

  const navStyles = getComponentStyle("navigation");
  const logoStyles = getComponentStyle("navigation", "logo");
  const navItemStyles = getComponentStyle("navigation", "navItem");

  const menuItems = [
    { label: t("navbar.home"), href: "/" },
    { label: t("navbar.pcshop"), href: "/pcshop" },
    { label: t("navbar.handmade"), href: "/handmade" },
    { label: t("navbar.builds"), href: "/ensambles" },
    { label: t("navbar.contact"), href: "/contacto" },
  ];

  const containerStyle: React.CSSProperties = {
    backgroundColor: navStyles.backgroundColor,
    borderBottom: navStyles.borderBottom,
    padding: navStyles.padding,
    position: "sticky" as const,
    top: 0,
    zIndex: 1000,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  };

  const logoStyle: React.CSSProperties = {
    fontSize: logoStyles.fontSize,
    fontWeight: logoStyles.fontWeight,
    color: logoStyles.color,
    textDecoration: "none",
    fontFamily: "Inter, system-ui, sans-serif",
  };

  const navItemStyle = (isActive: boolean = false): React.CSSProperties => ({
    padding: navItemStyles.padding,
    borderRadius: navItemStyles.borderRadius,
    transition: navItemStyles.transition,
    textDecoration: "none",
    color: isActive ? getColor("primary.700") : getColor("secondary.700"),
    backgroundColor: isActive ? getColor("primary.50") : "transparent",
    fontWeight: isActive ? "600" : "400",
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: getTypography("fontSize", "base"),
    cursor: "pointer",
  });

  const mobileMenuStyle: React.CSSProperties = {
    display: isMobileMenuOpen ? "flex" : "none",
    flexDirection: "column" as const,
    position: "absolute" as const,
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: getColor("white"),
    borderTop: `1px solid ${getColor("secondary.200")}`,
    padding: getSpacing("md"),
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  };

  // Si está cargando, mostrar navbar básico
  if (loading) {
    return (
      <nav style={containerStyle}>
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: `0 ${getSpacing("lg")}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <a href="/" style={logoStyle}>
            CyborgTech
          </a>
          <div>Cargando...</div>
        </div>
      </nav>
    );
  }

  return (
    <nav style={containerStyle}>
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: `0 ${getSpacing("lg")}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: getSpacing("md"),
        }}
      >
        {/* Logo */}
        <Link to="/" style={logoStyle}>
          CyborgTech
        </Link>

        {/* Desktop Menu */}
        <div
          style={{
            display: "none",
            gap: getSpacing("sm"),
            alignItems: "center",
          }}
          className="desktop-menu"
        >
          {menuItems.map((item, index) => (
            <Link key={index} to={item.href} style={navItemStyle(location.pathname === item.href)}>
              {item.label}
            </Link>
          ))}
          {/* Language selector */}
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as SupportedLang)}
            style={{
              marginLeft: getSpacing("sm"),
              padding: getSpacing("xs"),
              borderRadius: getComponentStyle("card").borderRadius,
              border: `1px solid ${getColor("secondary.200")}`,
              fontSize: getTypography("fontSize", "sm"),
              background: getColor("white"),
              cursor: "pointer",
            }}
            aria-label={t("navbar.language")}
          >
            {LANGS.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
          {/* Cart button desktop only */}
          <button
            onClick={() => setCartOpen(true)}
            className="cart-btn-desktop"
            style={{
              marginLeft: getSpacing("md"),
              background: "none",
              border: "none",
              position: "relative",
              cursor: "pointer",
              fontSize: 24,
              color: getColor("primary.700"),
              display: "flex",
              alignItems: "center",
            }}
            aria-label="Carrito"
          >
            🛒
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  background: "#e53e3e",
                  color: "white",
                  borderRadius: "50%",
                  fontSize: 12,
                  width: 20,
                  height: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  border: "2px solid white",
                }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            display: "block",
            background: "none",
            border: "none",
            fontSize: getTypography("fontSize", "xl"),
            color: getColor("secondary.700"),
            cursor: "pointer",
            padding: getSpacing("sm"),
          }}
          className="mobile-menu-button"
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>
        {/* Cart button mobile only */}
        <button
          onClick={() => setCartOpen(true)}
          className="cart-btn-mobile"
          style={{
            display: "block",
            background: "none",
            border: "none",
            position: "relative",
            cursor: "pointer",
            fontSize: 24,
            color: getColor("primary.700"),
            marginLeft: getSpacing("sm"),
          }}
          aria-label="Carrito"
        >
          🛒
          {cartCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: -6,
                right: -6,
                background: "#e53e3e",
                color: "white",
                borderRadius: "50%",
                fontSize: 12,
                width: 20,
                height: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                border: "2px solid white",
              }}
            >
              {cartCount}
            </span>
          )}
        </button>

        {/* Mobile Menu */}
        <div style={mobileMenuStyle} className="mobile-menu">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              style={{
                ...navItemStyle(location.pathname === item.href),
                padding: getSpacing("md"),
                borderBottom: `1px solid ${getColor("secondary.100")}`,
                width: "100%",
                textAlign: "center" as const,
              }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as SupportedLang)}
            style={{
              margin: `${getSpacing("sm")} 0`,
              padding: getSpacing("xs"),
              borderRadius: getComponentStyle("card").borderRadius,
              border: `1px solid ${getColor("secondary.200")}`,
              fontSize: getTypography("fontSize", "sm"),
              background: getColor("white"),
              cursor: "pointer",
            }}
            aria-label={t("navbar.language")}
          >
            {LANGS.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </nav>
  );
};

export default Navigation;
