import { useState, useEffect, createContext, useContext } from "react";
import type { ReactNode } from "react";

export type SupportedLang = "es" | "en" | "fr";

const LANG_KEY = "cyborgtech_lang";

const loadMessages = async (lang: SupportedLang) => {
  try {
    let messages;
    switch (lang) {
      case "en":
        messages = (await import("../i18n/en.json")).default;
        break;
      case "fr":
        messages = (await import("../i18n/fr.json")).default;
        break;
      default:
        messages = (await import("../i18n/es.json")).default;
        break;
    }
    return messages;
  } catch (error) {
    console.error("Error loading messages for language:", lang, error);
    // Fallback a español si hay error
    try {
      const fallbackMessages = (await import("../i18n/es.json")).default;
      return fallbackMessages;
    } catch (fallbackError) {
      console.error("Error loading fallback messages:", fallbackError);
      return {};
    }
  }
};

interface I18nContextProps {
  lang: SupportedLang;
  setLang: (lang: SupportedLang) => void;
  t: (key: string) => any;
  messages: any;
  loading: boolean;
}

const I18nContext = createContext<I18nContextProps | undefined>(undefined);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<SupportedLang>("es");
  const [messages, setMessages] = useState<any>({});
  const [loading, setLoading] = useState(true);

  // Detectar idioma navegador o localStorage
  useEffect(() => {
    const initializeLang = async () => {
      let initialLang: SupportedLang = "es"; // Español como idioma por defecto

      try {
        // Intentar obtener del localStorage primero
        const stored = localStorage.getItem(LANG_KEY) as SupportedLang | null;
        if (stored && ["es", "en", "fr"].includes(stored)) {
          initialLang = stored;
        } else {
          // Intentar detectar del navegador
          const browserLang = navigator.language?.slice(0, 2);
          if (browserLang && ["es", "en", "fr"].includes(browserLang)) {
            initialLang = browserLang as SupportedLang;
          }
          // Si no se puede determinar, se mantiene español como por defecto
        }
      } catch (error) {
        console.error("Error detecting language:", error);
        // En caso de error, se mantiene español como por defecto
      }

      setLangState(initialLang);

      try {
        const loadedMessages = await loadMessages(initialLang);
        setMessages(loadedMessages);
      } catch (error) {
        console.error("Error loading initial messages:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeLang();
  }, []);

  // Cambiar idioma manualmente
  const setLang = async (newLang: SupportedLang) => {
    setLangState(newLang);
    setLoading(true);
    try {
      localStorage.setItem(LANG_KEY, newLang);
    } catch (error) {
      console.error("Error saving language to localStorage:", error);
    }

    try {
      const loadedMessages = await loadMessages(newLang);
      setMessages(loadedMessages);
    } catch (error) {
      console.error("Error loading messages for language change:", error);
    } finally {
      setLoading(false);
    }
  };

  // Acceso a textos por key (soporta keys anidadas con ".")
  const t = (key: string): any => {
    if (loading) {
      return key;
    }
    if (!messages || Object.keys(messages).length === 0) {
      return key;
    }
    const result = key.split(".").reduce((o, i) => (o ? o[i] : undefined), messages) ?? key;
    if (result === key) {
      console.warn("Translation not found for key:", key);
    }
    return result;
  };

  return <I18nContext.Provider value={{ lang, setLang, t, messages, loading }}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
};
