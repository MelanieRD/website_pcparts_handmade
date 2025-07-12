import React, { useEffect, useState, useMemo } from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import ProductDetailsModal from "../components/ProductDetailsModal";
import { useI18n } from "../hooks/useI18n";
import { useCart } from "../components/CartContext";
import { useProducts } from "../hooks/useApi";
import type { Product } from "../services/api";
import "./Products.css";

type CategoryFilter =
  | "all"
  | "processor"
  | "graphics"
  | "motherboard"
  | "storage"
  | "case"
  | "cooling"
  | "assembly"
  | "headset"
  | "microphone"
  | "camera"
  | "lights"
  | "keyboard"
  | "mouse"
  | "monitor"
  | "ram"
  | "psu"
  | "accessory"
  | "bundle";
type SortOption = "name" | "price_low" | "price_high";

const Products: React.FC = () => {
  const { lang, t } = useI18n();
  const { data: products, loading, error } = useProducts();
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [subcategoryFilter, setSubcategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [searchTerm, setSearchTerm] = useState("");
  const [showOffersOnly, setShowOffersOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();

  // Get available subcategories for current category
  const availableSubcategories = useMemo(() => {
    if (categoryFilter === "all" || !products) return [];
    const subcategories = products.filter((product) => product.category === categoryFilter).map((product) => product.subcategory);
    return [...new Set(subcategories)];
  }, [products, categoryFilter]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return [];
    let filtered = products;

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((product) => product.category === categoryFilter);
    }

    // Apply subcategory filter
    if (subcategoryFilter !== "all") {
      filtered = filtered.filter((product) => product.subcategory === subcategoryFilter);
    }

    // Apply offers filter
    if (showOffersOnly) {
      filtered = filtered.filter((product) => product.isOffer === true);
    }

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter((product) => {
        const name = product.name[lang] || product.name["es"];
        const description = product.description[lang] || product.description["es"];
        const searchLower = searchTerm.toLowerCase();
        return name.toLowerCase().includes(searchLower) || description.toLowerCase().includes(searchLower);
      });
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name":
          const nameA = (a.name[lang] || a.name["es"]).toLowerCase();
          const nameB = (b.name[lang] || b.name["es"]).toLowerCase();
          return nameA.localeCompare(nameB);
        case "price_low":
          const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ""));
          const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ""));
          return priceA - priceB;
        case "price_high":
          const priceC = parseFloat(a.price.replace(/[^0-9.]/g, ""));
          const priceD = parseFloat(b.price.replace(/[^0-9.]/g, ""));
          return priceD - priceC;
        default:
          return 0;
      }
    });

    return sorted;
  }, [products, categoryFilter, subcategoryFilter, sortBy, searchTerm, showOffersOnly, lang]);

  // Reset subcategory when category changes
  useEffect(() => {
    setSubcategoryFilter("all");
    setCurrentPage(1); // Reset to first page when filters change
  }, [categoryFilter, subcategoryFilter, showOffersOnly, searchTerm]);

  // Scroll to top of products section
  const scrollToProducts = () => {
    const productsContainer = document.querySelector(".products-container");
    if (productsContainer) {
      productsContainer.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Handle page change with scroll to top
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    scrollToProducts();
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredAndSortedProducts.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div>
        <Navigation />
        <main style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1rem", textAlign: "center" }}>
          <div>Cargando productos...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navigation />
        <main style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1rem", textAlign: "center" }}>
          <div style={{ color: "red" }}>Error: {error}</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navigation />
      <main style={{ maxWidth: 1400, margin: "0 auto", padding: "2rem 1rem" }}>
        {/* Header Section */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              marginBottom: "0.5rem",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {t("products.title")}
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#666", maxWidth: "600px", margin: "0 auto" }}>{t("products.subtitle")}</p>
        </div>

        {/* Filters Section */}
        <div className="filters-section">
          <div className="filters-header">
            <div className="filters-title">
              🔍 {t("products.filters_title")}
              <span style={{ fontSize: "0.9rem", color: "#666", fontWeight: "400" }}>
                • {filteredAndSortedProducts.length} {t("products.results_count")}
              </span>
            </div>
            <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", gap: "1.5rem" }}>
              <input type="text" className="filter-input" style={{ maxWidth: 320 }} placeholder={t("navbar.search_placeholder")} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <button className="filters-toggle" onClick={() => setShowFilters(!showFilters)}>
              {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
            </button>
          </div>

          <div className={`filters-content ${showFilters ? "expanded" : "collapsed"}`}>
            {/* Offers Filter */}
            <div className="filter-group">
              <label className="filter-checkbox">
                <input type="checkbox" checked={showOffersOnly} onChange={(e) => setShowOffersOnly(e.target.checked)} />
                <span style={{ fontWeight: "600", color: "#e53e3e" }}>🏷️ {t("products.show_offers_only")}</span>
              </label>
            </div>

            {/* Category Filter */}
            <div className="filter-group">
              <label className="filter-label">📂 Categoría Principal</label>
              <select className="filter-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}>
                <option value="all">{t("products.filters.all")}</option>
                <option value="processor">{t("products.filters.processor")}</option>
                <option value="graphics">{t("products.filters.graphics")}</option>
                <option value="motherboard">{t("products.filters.motherboard")}</option>
                <option value="storage">{t("products.filters.storage")}</option>
                <option value="case">{t("products.filters.case")}</option>
                <option value="cooling">{t("products.filters.cooling")}</option>
                <option value="assembly">{t("products.filters.assembly")}</option>
                <option value="headset">{t("products.filters.headset")}</option>
                <option value="microphone">{t("products.filters.microphone")}</option>
                <option value="camera">{t("products.filters.camera")}</option>
                <option value="lights">{t("products.filters.lights")}</option>
                <option value="keyboard">{t("products.filters.keyboard")}</option>
                <option value="mouse">{t("products.filters.mouse")}</option>
                <option value="monitor">{t("products.filters.monitor")}</option>
                <option value="ram">{t("products.filters.ram")}</option>
                <option value="psu">{t("products.filters.psu")}</option>
                <option value="accessory">{t("products.filters.accessory")}</option>
                <option value="bundle">{t("products.filters.bundle")}</option>
              </select>
            </div>

            {/* Subcategory Filter */}
            {availableSubcategories.length > 0 && (
              <div className="filter-group">
                <label className="filter-label">📋 Subcategoría</label>
                <select className="filter-select" value={subcategoryFilter} onChange={(e) => setSubcategoryFilter(e.target.value)}>
                  <option value="all">Todas las subcategorías</option>
                  {availableSubcategories.map((subcat) => (
                    <option key={subcat} value={subcat}>
                      {t(`products.subcategories.${subcat}`) || subcat}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Sort */}
            <div className="filter-group">
              <label className="filter-label">🔄 {t("products.sort_by")}</label>
              <select className="filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)}>
                <option value="name">{t("products.sort_options.name")}</option>
                <option value="price_low">{t("products.sort_options.price_low")}</option>
                <option value="price_high">{t("products.sort_options.price_high")}</option>
              </select>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="quick-filters">
            {["all", "processor", "graphics", "storage", "keyboard", "mouse", "headset", "bundle"].map((cat) => (
              <button key={cat} className={`quick-filter-btn ${categoryFilter === cat ? "active" : ""}`} onClick={() => setCategoryFilter(cat as CategoryFilter)}>
                {t(`products.filters.${cat}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="products-container">
          {/* Products Display */}
          {currentProducts.length > 0 ? (
            <>
              <div className="products-grid">
                {currentProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    name={product.name[lang] || product.name["es"]}
                    description={product.description[lang] || product.description["es"]}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    image={product.thumbnailImage}
                    isOffer={product.isOffer}
                    onAddToCart={() =>
                      addToCart({
                        id: product.id,
                        name: product.name[lang] || product.name["es"],
                        price: parseFloat(product.price.replace(/[^0-9.]/g, "")),
                        image: product.thumbnailImage,
                      })
                    }
                    onShowDetails={() => {
                      setSelectedProduct(product);
                      setDetailsOpen(true);
                    }}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination-container">
                  <button className="pagination-button" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
                    ← Anterior
                  </button>

                  <div>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button key={pageNum} className={`page-button ${currentPage === pageNum ? "active" : ""}`} onClick={() => handlePageChange(pageNum)}>
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button className="pagination-button" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>
                    Siguiente →
                  </button>
                </div>
              )}

              {/* Page Info */}
              <div
                style={{
                  textAlign: "center",
                  marginTop: "1rem",
                  color: "#666",
                  fontSize: "0.9rem",
                }}
              >
                Página {currentPage} de {totalPages} • Mostrando {startIndex + 1}-{Math.min(endIndex, filteredAndSortedProducts.length)} de {filteredAndSortedProducts.length} productos
              </div>
            </>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "4rem 2rem",
                background: "#f8f9fa",
                borderRadius: "12px",
                color: "#666",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
              <h3 style={{ marginBottom: "0.5rem", color: "#333" }}>{t("products.no_results")}</h3>
              <p>Intenta ajustar los filtros o términos de búsqueda</p>
            </div>
          )}
        </div>
        <ProductDetailsModal open={detailsOpen} onClose={() => setDetailsOpen(false)} product={selectedProduct} lang={lang} />
      </main>
      <Footer />
    </div>
  );
};

export default Products;
