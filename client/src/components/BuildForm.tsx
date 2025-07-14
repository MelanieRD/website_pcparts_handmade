import React, { useState, useEffect } from "react";
import type { Build, BuildComponent } from "../services/api";
import ImageGalleryManager from "./ImageGalleryManager";
import SpecificationsManager from "./SpecificationsManager";
import "./FormStyles.css";

interface BuildFormProps {
  build?: Build | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (build: Omit<Build, "id">) => Promise<void>;
  mode: "add" | "edit";
}

const BuildForm: React.FC<BuildFormProps> = ({ build, isOpen, onClose, onSubmit, mode }) => {
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
    components: [] as BuildComponent[],
    isOffer: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newComponent, setNewComponent] = useState({
    productId: "",
    quantity: 1,
    notes: "",
  });

  useEffect(() => {
    if (build && mode === "edit") {
      setFormData({
        name: {
          es: build.name.es || "",
          en: build.name.en || "",
          fr: build.name.fr || "",
        },
        description: {
          es: build.description.es || "",
          en: build.description.en || "",
          fr: build.description.fr || "",
        },
        longDescription: {
          es: build.longDescription.es || "",
          en: build.longDescription.en || "",
          fr: build.longDescription.fr || "",
        },
        price: build.price,
        originalPrice: build.originalPrice || "",
        stock: build.stock || 0,
        acquisitionDate: build.acquisitionDate || "",
        thumbnailImage: build.thumbnailImage || "",
        featureImages: build.featureImages || [],
        category: build.category,
        subcategory: build.subcategory,
        specs: build.specs || {},
        components: build.components || [],
        isOffer: build.isOffer || false,
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
        components: [],
        isOffer: false,
      });
    }
  }, [build, mode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError("Error al guardar el build. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const addComponent = () => {
    if (newComponent.productId.trim()) {
      setFormData({
        ...formData,
        components: [...formData.components, { ...newComponent }],
      });
      setNewComponent({ productId: "", quantity: 1, notes: "" });
    }
  };

  const removeComponent = (index: number) => {
    setFormData({
      ...formData,
      components: formData.components.filter((_, i) => i !== index),
    });
  };

  // const updateComponent = (index: number, field: keyof BuildComponent, value: any) => {
  //   const updatedComponents = [...formData.components];
  //   updatedComponents[index] = { ...updatedComponents[index], [field]: value };
  //   setFormData({ ...formData, components: updatedComponents });
  // };

  if (!isOpen) return null;

  return (
    <div className="form-modal-bg">
      <div className="form-container">
        <div className="form-header">
          <h2 className="form-title">{mode === "add" ? "🔧 Agregar Build" : "✏️ Editar Build"}</h2>
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
                  placeholder="Ej: PC Gaming Pro"
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
                  placeholder="Ex: Pro Gaming PC"
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
                  placeholder="Ex: PC Gaming Pro"
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
                  placeholder="Descripción breve del build"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Descripción Corta (English) *</label>
                <textarea
                  className="form-input form-textarea"
                  value={formData.description.en}
                  onChange={(e) => setFormData({ ...formData, description: { ...formData.description, en: e.target.value } })}
                  required
                  placeholder="Short build description"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Descripción Corta (Français) *</label>
                <textarea
                  className="form-input form-textarea"
                  value={formData.description.fr}
                  onChange={(e) => setFormData({ ...formData, description: { ...formData.description, fr: e.target.value } })}
                  required
                  placeholder="Description courte du build"
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
                  placeholder="Descripción detallada del build y sus componentes"
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
                  placeholder="Detailed description of the build and its components"
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
                  placeholder="Description détaillée du build et de ses composants"
                  rows={4}
                />
              </div>
            </div>

            {/* Precios y Stock */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Precio de Venta *</label>
                <input className="form-input" type="text" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required placeholder="1299.99" />
              </div>
              <div className="form-group">
                <label className="form-label">Precio Base</label>
                <input className="form-input" type="text" value={formData.originalPrice} onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })} placeholder="1499.99" />
              </div>
              <div className="form-group">
                <label className="form-label">Cantidad en Stock *</label>
                <input className="form-input" type="number" min="0" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })} required placeholder="3" />
              </div>
              <div className="form-group">
                <label className="form-label">Fecha de Ensamblaje</label>
                <input className="form-input" type="date" value={formData.acquisitionDate} onChange={(e) => setFormData({ ...formData, acquisitionDate: e.target.value })} />
              </div>
            </div>

            {/* Imagen Principal */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Imagen Principal *</label>
                <input
                  className="form-input"
                  type="url"
                  value={formData.thumbnailImage}
                  onChange={(e) => setFormData({ ...formData, thumbnailImage: e.target.value })}
                  required
                  placeholder="https://example.com/thumbnail.jpg"
                />
                {formData.thumbnailImage && (
                  <div className="form-image-preview">
                    <div className="form-image-item">
                      <img src={formData.thumbnailImage} alt="Thumbnail" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Galería de imágenes */}
            <ImageGalleryManager images={formData.featureImages} onChange={(images) => setFormData({ ...formData, featureImages: images })} />

            {/* Categorías */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Categoría *</label>
                <input className="form-input" type="text" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required placeholder="Ej: builds" />
              </div>
              <div className="form-group">
                <label className="form-label">Subcategoría *</label>
                <input className="form-input" type="text" value={formData.subcategory} onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })} required placeholder="Ej: gaming" />
              </div>
            </div>

            {/* Componentes del Build */}
            <div className="form-group">
              <label className="form-label">Componentes del Build</label>

              {/* Agregar nuevo componente */}
              <div className="component-input-container">
                <input
                  className="form-input"
                  type="text"
                  value={newComponent.productId}
                  onChange={(e) => setNewComponent({ ...newComponent, productId: e.target.value })}
                  placeholder="ID del producto"
                />
                <input
                  className="form-input"
                  type="number"
                  min="1"
                  value={newComponent.quantity}
                  onChange={(e) => setNewComponent({ ...newComponent, quantity: Number(e.target.value) })}
                  placeholder="Cantidad"
                />
                <input className="form-input" type="text" value={newComponent.notes} onChange={(e) => setNewComponent({ ...newComponent, notes: e.target.value })} placeholder="Notas (opcional)" />
                <button type="button" className="form-btn form-btn-small" onClick={addComponent} disabled={!newComponent.productId.trim()}>
                  ➕ Agregar
                </button>
              </div>

              {/* Lista de componentes */}
              {formData.components.length > 0 && (
                <div className="components-list">
                  {formData.components.map((component, index) => (
                    <div key={index} className="component-item">
                      <div className="component-info">
                        <span className="component-id">ID: {component.productId}</span>
                        <span className="component-quantity">Cantidad: {component.quantity}</span>
                        {component.notes && <span className="component-notes">Notas: {component.notes}</span>}
                      </div>
                      <button type="button" className="form-btn form-btn-small" onClick={() => removeComponent(index)} title="Eliminar componente">
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {formData.components.length === 0 && (
                <div className="components-empty">
                  <p>No hay componentes agregados. Agrega componentes usando los campos de arriba.</p>
                </div>
              )}
            </div>

            {/* Especificaciones */}
            <SpecificationsManager specs={formData.specs} onChange={(specs) => setFormData({ ...formData, specs })} title="Especificaciones del Build" />

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
            {loading ? "⏳ Guardando..." : mode === "add" ? "✅ Agregar Build" : "💾 Guardar Cambios"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuildForm;
