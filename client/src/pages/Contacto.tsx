import React from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import LoadingState from "../components/LoadingState";
import { useI18n } from "../hooks/useI18n";

const Contacto: React.FC = () => {
  const { t, loading } = useI18n();

  if (loading) {
    return <LoadingState message={t("common.loading") || "Cargando..."} />;
  }

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <Navigation />
      <main style={{ maxWidth: 700, margin: "0 auto", padding: "2rem 1rem" }}>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: 24 }}>{t("contact.title") || "Contacto"}</h1>
        <p style={{ fontSize: "1.1rem", color: "#555", marginBottom: 32 }}>
          {t("contact.description") || "¿Tienes dudas, comentarios o quieres cotizar un producto? Escríbenos y te responderemos lo antes posible."}
        </p>
        <form style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 400 }}>
          <input type="text" placeholder={t("contact.form.name") || "Nombre"} required style={{ padding: 12, borderRadius: 8, border: "1px solid #ccc", fontSize: "1rem" }} />
          <input type="email" placeholder={t("contact.form.email") || "Correo electrónico"} required style={{ padding: 12, borderRadius: 8, border: "1px solid #ccc", fontSize: "1rem" }} />
          <textarea placeholder={t("contact.form.message") || "Mensaje"} required rows={5} style={{ padding: 12, borderRadius: 8, border: "1px solid #ccc", fontSize: "1rem" }} />
          <button type="submit" style={{ padding: "12px 0", background: "#667eea", color: "white", border: "none", borderRadius: 8, fontWeight: 700, fontSize: "1.1rem", cursor: "pointer" }}>
            {t("contact.form.submit") || "Enviar mensaje"}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default Contacto;
