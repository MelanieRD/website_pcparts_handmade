import React, { useState, useEffect } from "react";
import type { HandmadeProduct } from "../services/api";
import ImageGalleryManager from "./ImageGalleryManager";
import SpecificationsManager from "./SpecificationsManager";
import ThumbnailUploader from "./ThumbnailUploader";
import "./FormStyles.css";

interface HandmadeFormProps {
  handmade?: HandmadeProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (handmade: Omit<HandmadeProduct, "id">) => Promise<void>;
  mode: "add" | "edit";
}

const HandmadeForm: React.FC<HandmadeFormProps> = ({ handmade, isOpen, onClose, onSubmit, mode }) => {
  const [formData, setFormData] = useState({
    name: { es: "", en: "", fr: "" },
    description: { es: "", en: "", fr: "" },
    longDescription: { es: "", en: "", fr: "" },
    price: "",
    originalPrice: "",
    stock: 0,
    acquisitionDate: "",
    thumbnailImage: "",
    featureImages: [] as string[],
    category: "",
    subcategory: "",
    specs: {} as Record<string, string>,
    isOffer: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (handmade && mode === "edit") {
      setFormData({
        name: {
          es: handmade.name.es || "",
          en: handmade.name.en || "",
          fr: handmade.name.fr || "",
        },
        description: {
          es: handmade.description.es || "",
          en: handmade.description.en || "",
          fr: handmade.description.fr || "",
        },
        longDescription: {
          es: handmade.longDescription.es || "",
          en: handmade.longDescription.en || "",
          fr: handmade.longDescription.fr || "",
        },
        price: handmade.price,
        originalPrice: handmade.originalPrice || "",
        stock: handmade.stock || 0,
        acquisitionDate: handmade.acquisitionDate || "",
        thumbnailImage: handmade.thumbnailImage || "",
        featureImages: handmade.featureImages || [],
        category: handmade.category,
        subcategory: handmade.subcategory,
        specs: handmade.specs || {},
        isOffer: handmade.isOffer || false,
      });
    } else {
      setFormData({
        name: { es: "", en: "", fr: "" },
        description: { es: "", en: "", fr: "" },
        longDescription: { es: "", en: "", fr: "" },
        price: "",
        originalPrice: "",
        stock: 0,
        acquisitionDate: "",
        thumbnailImage: "",
        featureImages: [],
        category: "",
        subcategory: "",
        specs: {},
        isOffer: false,
      });
    }
  }, [handmade, mode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError("Error al guardar el producto handmade. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="form-modal-bg">
      <div className="form-container">
        <div className="form-header">
          <h2 className="form-title">{mode === "add" ? "🎨 Agregar Producto Handmade" : "✏️ Editar Producto Handmade"}</h2>
          <button className="form-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="form-body">
          <form onSubmit={handleSubmit}>
            {error && <div className="form-error">{error}</div>}

            {/* Información Básica */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nombre (Español) *</label>
                <input
                  className="form-input"
                  type="text"
                  value={formData.name.es}
                  onChange={(e) => setFormData({ ...formData, name: { ...formData.name, es: e.target.value } })}
                  required
                  placeholder="Ej: Collar de Plata Artesanal"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Nombre (English) *</label>
                <input
                  className="form-input"
                  type="text"
                  value={formData.name.en}
                  onChange={(e) => setFormData({ ...formData, name: { ...formData.name, en: e.target.value } })}
                  required
                  placeholder="Ex: Handcrafted Silver Necklace"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Nombre (Français) *</label>
                <input
                  className="form-input"
                  type="text"
                  value={formData.name.fr}
                  onChange={(e) => setFormData({ ...formData, name: { ...formData.name, fr: e.target.value } })}
                  required
                  placeholder="Ex: Collier en Argent Artisanal"
                />
              </div>
            </div>

            {/* Descripción Corta */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Descripción Corta (Español) *</label>
                <textarea
                  className="form-input form-textarea"
                  value={formData.description.es}
                  onChange={(e) => setFormData({ ...formData, description: { ...formData.description, es: e.target.value } })}
                  required
                  placeholder="Descripción breve del producto"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Descripción Corta (English) *</label>
                <textarea
                  className="form-input form-textarea"
                  value={formData.description.en}
                  onChange={(e) => setFormData({ ...formData, description: { ...formData.description, en: e.target.value } })}
                  required
                  placeholder="Short product description"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Descripción Corta (Français) *</label>
                <textarea
                  className="form-input form-textarea"
                  value={formData.description.fr}
                  onChange={(e) => setFormData({ ...formData, description: { ...formData.description, fr: e.target.value } })}
                  required
                  placeholder="Description courte du produit"
                />
              </div>
            </div>

            {/* Descripción Larga */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Descripción Larga (Español) *</label>
                <textarea
                  className="form-input form-textarea"
                  value={formData.longDescription.es}
                  onChange={(e) => setFormData({ ...formData, longDescription: { ...formData.longDescription, es: e.target.value } })}
                  required
                  placeholder="Descripción detallada del proceso artesanal"
                  rows={4}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Descripción Larga (English) *</label>
                <textarea
                  className="form-input form-textarea"
                  value={formData.longDescription.en}
                  onChange={(e) => setFormData({ ...formData, longDescription: { ...formData.longDescription, en: e.target.value } })}
                  required
                  placeholder="Detailed description of the crafting process"
                  rows={4}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Descripción Larga (Français) *</label>
                <textarea
                  className="form-input form-textarea"
                  value={formData.longDescription.fr}
                  onChange={(e) => setFormData({ ...formData, longDescription: { ...formData.longDescription, fr: e.target.value } })}
                  required
                  placeholder="Description détaillée du processus artisanal"
                  rows={4}
                />
              </div>
            </div>

            {/* Precios y Stock */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Precio de Venta *</label>
                <input className="form-input" type="text" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required placeholder="99.99" />
              </div>
              <div className="form-group">
                <label className="form-label">Precio Base</label>
                <input className="form-input" type="text" value={formData.originalPrice} onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })} placeholder="129.99" />
              </div>
              <div className="form-group">
                <label className="form-label">Cantidad en Stock *</label>
                <input className="form-input" type="number" min="0" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })} required placeholder="5" />
              </div>
              <div className="form-group">
                <label className="form-label">Fecha de Creación</label>
                <input className="form-input" type="date" value={formData.acquisitionDate} onChange={(e) => setFormData({ ...formData, acquisitionDate: e.target.value })} />
              </div>
            </div>

            {/* Componente para subir imagen principal a Cloudinary */}
            <ThumbnailUploader value={formData.thumbnailImage} onChange={(url) => setFormData({ ...formData, thumbnailImage: url })} required={true} />

            {/* Nuevo componente para gestión de galería de imágenes */}
            <ImageGalleryManager images={formData.featureImages} onChange={(images) => setFormData({ ...formData, featureImages: images })} />

            {/* Categorías */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Categoría *</label>
                <input className="form-input" type="text" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required placeholder="Ej: joyeria" />
              </div>
              <div className="form-group">
                <label className="form-label">Subcategoría *</label>
                <input
                  className="form-input"
                  type="text"
                  value={formData.subcategory}
                  onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  required
                  placeholder="Ej: collares"
                />
              </div>
            </div>

            {/* Nuevo componente para gestión de especificaciones */}
            <SpecificationsManager specs={formData.specs} onChange={(specs) => setFormData({ ...formData, specs })} title="Especificaciones del Producto Handmade" />

            {/* Opciones */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <input type="checkbox" checked={formData.isOffer} onChange={(e) => setFormData({ ...formData, isOffer: e.target.checked })} />
                  🏷️ Oferta
                </label>
              </div>
            </div>
          </form>
        </div>

        <div className="form-btn-container">
          <button className="form-btn form-btn-cancel" type="button" onClick={onClose}>
            ❌ Cancelar
          </button>
          <button className="form-btn" type="button" onClick={handleSubmit} disabled={loading}>
            {loading ? "⏳ Guardando..." : mode === "add" ? "✅ Agregar Handmade" : "💾 Guardar Cambios"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HandmadeForm;
