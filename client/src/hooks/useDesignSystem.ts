import { useState, useEffect } from "react";
import designSystemData from "../design-system.json";

export interface DesignSystem {
  colors: {
    primary: Record<string, string>;
    secondary: Record<string, string>;
    accent: Record<string, string>;
    success: string;
    warning: string;
    error: string;
    white: string;
    black: string;
  };
  typography: {
    fontFamily: {
      sans: string[];
      mono: string[];
    };
    fontSize: Record<string, string>;
    fontWeight: Record<string, string>;
    lineHeight: Record<string, string>;
  };
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
  components: {
    navigation: any;
    button: any;
    card: any;
    hero: any;
  };
}

export const useDesignSystem = () => {
  const [designSystem, setDesignSystem] = useState<DesignSystem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setDesignSystem(designSystemData as DesignSystem);
      setLoading(false);
    } catch (err) {
      setError("Failed to load design system");
      setLoading(false);
    }
  }, []);

  const getColor = (colorPath: string): string => {
    if (!designSystem) return "";

    const path = colorPath.split(".");
    let current: any = designSystem.colors;

    for (const key of path) {
      if (current[key] === undefined) return "";
      current = current[key];
    }

    return current;
  };

  const getTypography = (type: "fontSize" | "fontWeight" | "lineHeight", size: string): string => {
    if (!designSystem) return "";
    return designSystem.typography[type][size] || "";
  };

  const getSpacing = (size: string): string => {
    if (!designSystem) return "";
    return designSystem.spacing[size] || "";
  };

  const getBorderRadius = (size: string): string => {
    if (!designSystem) return "";
    return designSystem.borderRadius[size] || "";
  };

  const getShadow = (size: string): string => {
    if (!designSystem) return "";
    return designSystem.shadows[size] || "";
  };

  const getComponentStyle = (component: keyof DesignSystem["components"], variant?: string): any => {
    if (!designSystem) return {};

    if (variant) {
      return designSystem.components[component]?.[variant] || {};
    }

    return designSystem.components[component] || {};
  };

  return {
    designSystem,
    loading,
    error,
    getColor,
    getTypography,
    getSpacing,
    getBorderRadius,
    getShadow,
    getComponentStyle,
  };
};
