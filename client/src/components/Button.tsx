import React from "react";
import { useDesignSystem } from "../hooks/useDesignSystem";

interface ButtonProps {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ variant = "primary", size = "md", children, onClick, href, disabled = false, className = "" }) => {
  const { getComponentStyle, getTypography, getSpacing } = useDesignSystem();

  const buttonStyles = getComponentStyle("button", variant);

  const sizeMap = {
    sm: { padding: getSpacing("xs"), fontSize: getTypography("fontSize", "sm") },
    md: { padding: buttonStyles.padding, fontSize: getTypography("fontSize", "base") },
    lg: { padding: `${getSpacing("md")} ${getSpacing("xl")}`, fontSize: getTypography("fontSize", "lg") },
  };

  const baseStyle: React.CSSProperties = {
    backgroundColor: buttonStyles.backgroundColor,
    color: buttonStyles.color,
    padding: sizeMap[size].padding,
    borderRadius: buttonStyles.borderRadius,
    fontWeight: buttonStyles.fontWeight,
    border: buttonStyles.border,
    cursor: disabled ? "not-allowed" : buttonStyles.cursor,
    transition: buttonStyles.transition,
    fontSize: sizeMap[size].fontSize,
    fontFamily: "Inter, system-ui, sans-serif",
    textDecoration: "none",
    display: "inline-block",
    opacity: disabled ? 0.6 : 1,
    ...(disabled && {
      backgroundColor: "#e5e7eb",
      color: "#6b7280",
      border: "1px solid #d1d5db",
    }),
  };

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    onClick?.();
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;

    const target = e.currentTarget;
    if (buttonStyles.hover) {
      Object.entries(buttonStyles.hover).forEach(([key, value]) => {
        (target.style as any)[key] = value;
      });
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;

    const target = e.currentTarget;
    // Reset to base styles
    target.style.backgroundColor = buttonStyles.backgroundColor;
    target.style.color = buttonStyles.color;
    target.style.transform = "";
    target.style.boxShadow = "";
  };

  if (href) {
    return (
      <a href={href} style={baseStyle} onClick={handleClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className={className}>
        {children}
      </a>
    );
  }

  return (
    <button style={baseStyle} onClick={handleClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} disabled={disabled} className={className}>
      {children}
    </button>
  );
};

export default Button;
