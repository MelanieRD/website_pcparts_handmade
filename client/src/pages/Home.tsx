import React from "react";
import Navigation from "../components/Navigation";
import Button from "../components/Button";
import { useI18n } from "../hooks/useI18n";
import Footer from "../components/Footer";

const Home: React.FC = () => {
  const { t, loading } = useI18n();
  // const [search, setSearch] = useState("");

  if (loading) {
    return (
      <div style={{ fontFamily: "Inter, system-ui, sans-serif", textAlign: "center", padding: "2rem" }}>
        <Navigation />
        <div>{t("common.loading") || "Cargando..."}</div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <Navigation />

      {/* Hero Section with gaming keyboard background */}
      <section
        style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), 
                    url('/background.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          padding: "6rem 2rem",
          textAlign: "center",
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 2 }}>
          <h1
            style={{
              fontSize: "4rem",
              fontWeight: 800,
              color: "white",
              marginBottom: "1.5rem",
              lineHeight: 1.2,
             
              background: "linear-gradient(45deg, #667eea, #764ba2, #f093fb)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
             {t("home.brand") || "CyborgTech"}
          </h1>

          <p
            style={{
              fontSize: "1.5rem",
              color: "rgba(255,255,255,0.9)",
              marginBottom: "2rem",
              maxWidth: "700px",
              marginLeft: "auto",
              marginRight: "auto",
              lineHeight: 1.6,
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            {t("home.hero")}
          </p>

          <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
            <div
              style={{
                position: "relative",
                maxWidth: "500px",
                width: "100%",
              }}
            >
             
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Button href="/pcshop" variant="primary" size="lg">
              🛒 {t("home.cta_products")}
            </Button>
            <Button href="/ensambles" variant="secondary" size="lg">
              🖥️ {t("home.cta_builds")}
            </Button>
            <Button href="/handmade" variant="secondary" size="lg">
              ✨ {t("home.cta_handmade")}
            </Button>
          </div>
        </div>
      </section>

      {/* Sección de Servicios */}
      <section
        style={{
          padding: "5rem 2rem",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "3rem",
              fontWeight: 800,
              textAlign: "center",
              marginBottom: "3rem",
              textShadow: "0 4px 8px rgba(0,0,0,0.3)",
            }}
          >
            🚀 {t("home.services_title")}
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                borderRadius: "20px",
                padding: "2rem",
                textAlign: "center",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🖥️</div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>{t("home.services.0.title")}</h3>
              <p style={{ lineHeight: 1.6, opacity: 0.9 }}>{t("home.services.0.desc")}</p>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                borderRadius: "20px",
                padding: "2rem",
                textAlign: "center",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔧</div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>{t("home.services.1.title")}</h3>
              <p style={{ lineHeight: 1.6, opacity: 0.9 }}>{t("home.services.1.desc")}</p>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                borderRadius: "20px",
                padding: "2rem",
                textAlign: "center",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✨</div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>{t("home.services.2.title")}</h3>
              <p style={{ lineHeight: 1.6, opacity: 0.9 }}>{t("home.services.2.desc")}</p>
            </div>
          </div>
        </div>
      </section>

     

      {/* Sección de Productos Destacados */}
      <section
        style={{
          padding: "5rem 2rem",
          background: "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "3rem",
              fontWeight: 800,
              textAlign: "center",
              marginBottom: "1rem",
              color: "#1f2937",
            }}
          >
            ⭐ {t("home.featured_products_title")}
          </h2>
          <p
            style={{
              fontSize: "1.2rem",
              textAlign: "center",
              color: "#6b7280",
              marginBottom: "3rem",
              maxWidth: "600px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            {t("home.featured_products_desc")}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "2rem",
            }}
          >
            {[
              { icon: "🖥️", title: t("home.featured_products.0.title"), desc: t("home.featured_products.0.desc"), price: t("home.featured_products.0.price") },
              { icon: "💻", title: t("home.featured_products.1.title"), desc: t("home.featured_products.1.desc"), price: t("home.featured_products.1.price") },
              { icon: "🎮", title: t("home.featured_products.2.title"), desc: t("home.featured_products.2.desc"), price: t("home.featured_products.2.price") },
              { icon: "✨", title: t("home.featured_products.3.title"), desc: t("home.featured_products.3.desc"), price: t("home.featured_products.3.price") },
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  background: "white",
                  borderRadius: "20px",
                  padding: "2rem",
                  textAlign: "center",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  transition: "transform 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{item.icon}</div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1f2937", marginBottom: "0.5rem" }}>{item.title}</h3>
                <p style={{ color: "#6b7280", marginBottom: "1rem" }}>{item.desc}</p>
                <div
                  style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    padding: "0.5rem 1rem",
                    borderRadius: "15px",
                    fontWeight: 600,
                  }}
                >
                  {item.price}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

       {/* Sección de Ubicación y Contacto */}
       <section
        style={{
          padding: "5rem 2rem",
          background: "white",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
              gap: "3rem",
              alignItems: "center",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "2.5rem",
                  fontWeight: 800,
                  color: "#1f2937",
                  marginBottom: "1.5rem",
                }}
              >
                📍 {t("home.find_us")}
              </h2>
              <p
                style={{
                  fontSize: "1.2rem",
                  color: "#6b7280",
                  lineHeight: 1.6,
                  marginBottom: "2rem",
                }}
              >
                {t("home.find_us_desc")}
              </p>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 600, color: "#374151", marginBottom: "1rem" }}>🏖️ {t("home.why_terrenas")}</h3>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  <li style={{ marginBottom: "0.5rem", color: "#6b7280" }}>• {t("home.terrenas_beach")}</li>
                  <li style={{ marginBottom: "0.5rem", color: "#6b7280" }}>• {t("home.catey_airport")}</li>
                  <li style={{ marginBottom: "0.5rem", color: "#6b7280" }}>• {t("home.tourist_center")}</li>
                  <li style={{ marginBottom: "0.5rem", color: "#6b7280" }}>• {t("home.tech_community")}</li>
                </ul>
              </div>

              <Button href="/contacto" variant="primary" size="lg">
                📞 {t("home.contact_btn")}
              </Button>
            </div>

            <div
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "20px",
                padding: "2rem",
                color: "white",
                textAlign: "center",
              }}
            >
              <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>🕒 {t("home.hours_title")}</h3>
              <div style={{ marginBottom: "1.5rem" }}>
                <p style={{ marginBottom: "0.5rem" }}>
                  <strong>{t("home.hours_weekdays_label")}</strong> {t("home.hours_weekdays")}
                </p>
                <p style={{ marginBottom: "0.5rem" }}>
                  <strong>{t("home.hours_saturday_label")}</strong> {t("home.hours_saturday")}
                </p>
                <p style={{ marginBottom: "0.5rem" }}>
                  <strong>{t("home.hours_sunday_label")}</strong> {t("home.hours_sunday")}
                </p>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <h4 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "0.5rem" }}>📱 {t("home.quick_contact")}</h4>
                <p style={{ marginBottom: "0.5rem" }}>{t("home.whatsapp")}</p>
                <p style={{ marginBottom: "0.5rem" }}>{t("home.email")}</p>
              </div>

              <div
                style={{
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: "10px",
                  padding: "1rem",
                  marginTop: "1rem",
                }}
              >
                <p style={{ fontSize: "0.9rem", opacity: 0.9 }}>🚚 {t("home.shipping")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          padding: "5rem 2rem",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          textAlign: "center",
          color: "white",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "3rem",
              fontWeight: 800,
              marginBottom: "1.5rem",
              textShadow: "0 4px 8px rgba(0,0,0,0.3)",
            }}
          >
            🚀 {t("home.cta_ready_title")}
          </h2>
          <p
            style={{
              fontSize: "1.3rem",
              marginBottom: "2rem",
              lineHeight: 1.6,
              opacity: 0.9,
            }}
          >
            {t("home.cta_ready_desc")}
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Button href="/pcshop" variant="primary" size="lg">
              🛒 {t("home.cta_ready_cta_products")}
            </Button>
            <Button href="/contacto" variant="secondary" size="lg">
              📞 {t("home.cta_ready_contact_btn")}
            </Button>
          </div>
        </div>
      </section>


      <Footer />
    </div>
  );
};

export default Home;
