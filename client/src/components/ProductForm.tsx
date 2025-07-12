import React, { useState, useEffect } from "react";
import type { Product } from "../services/api";
import "./FormStyles.css";

interface ProductFormProps {
  product?: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: Omit<Product, "id">) => Promise<void>;
  mode: "add" | "edit";
}

const ProductForm: React.FC<ProductFormProps> = ({ product, isOpen, onClose, onSubmit, mode }) => {
  const [formData, setFormData] = useState({
    name: { es: "", en: "", fr: "" },
    description: { es: "", en: "", fr: "" },
    price: "",
    originalPrice: "",
    stock: 0,
    acquisitionDate: "",
    thumbnailImage: "",
    featureImages: [] as string[],
    category: "",
    subcategory: "",
    brand: "",
    isNew: false,
    isPopular: false,
    isOffer: false,
    specs: {} as Record<string, string>,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (product && mode === "edit") {
      setFormData({
        name: {
          es: product.name.es || "",
          en: product.name.en || "",
          fr: product.name.fr || "",
        },
        description: {
          es: product.description.es || "",
          en: product.description.en || "",
          fr: product.description.fr || "",
        },
        price: product.price,
        originalPrice: product.originalPrice || "",
        stock: product.stock || 0,
        acquisitionDate: product.acquisitionDate || "",
        thumbnailImage: product.thumbnailImage || "",
        featureImages: product.featureImages || [],
        category: product.category,
        subcategory: product.subcategory,
        brand: product.brand || "",
        isNew: product.isNew || false,
        isPopular: product.isPopular || false,
        isOffer: product.isOffer || false,
        specs: product.specs || {},
      });
    } else {
      setFormData({
        name: { es: "", en: "", fr: "" },
        description: { es: "", en: "", fr: "" },
        price: "",
        originalPrice: "",
        stock: 0,
        acquisitionDate: "",
        thumbnailImage: "",
        featureImages: [],
        category: "",
        subcategory: "",
        brand: "",
        isNew: false,
        isPopular: false,
        isOffer: false,
        specs: {},
      });
    }
  }, [product, mode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError("Error al guardar el producto. Inténtalo de nuevo.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="form-modal-bg">
      <div className="form-container">
        <div className="form-header">
          <h2 className="form-title">{mode === "add" ? "➕ Agregar Producto" : "✏️ Editar Producto"}</h2>
        </div>

        <div className="form-body">
          <form onSubmit={handleSubmit}>
            {error && <div className="form-error">{error}</div>}

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nombre (Español) *</label>
                <input
                  className="form-input"
                  type="text"
                  value={formData.name.es}
                  onChange={(e) => setFormData({ ...formData, name: { ...formData.name, es: e.target.value } })}
                  required
                  placeholder="Ej: Laptop Gaming Pro"
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
                  placeholder="Ex: Gaming Laptop Pro"
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
                  placeholder="Ex: Ordinateur Gaming Pro"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Descripción (Español) *</label>
                <textarea
                  className="form-input form-textarea"
                  value={formData.description.es}
                  onChange={(e) => setFormData({ ...formData, description: { ...formData.description, es: e.target.value } })}
                  required
                  placeholder="Descripción detallada del producto en español"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Descripción (English) *</label>
                <textarea
                  className="form-input form-textarea"
                  value={formData.description.en}
                  onChange={(e) => setFormData({ ...formData, description: { ...formData.description, en: e.target.value } })}
                  required
                  placeholder="Detailed product description in English"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Descripción (Français) *</label>
                <textarea
                  className="form-input form-textarea"
                  value={formData.description.fr}
                  onChange={(e) => setFormData({ ...formData, description: { ...formData.description, fr: e.target.value } })}
                  required
                  placeholder="Description détaillée du produit en français"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Precio de Venta *</label>
                <input className="form-input" type="text" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required placeholder="299.99" />
              </div>
              <div className="form-group">
                <label className="form-label">Precio Base</label>
                <input className="form-input" type="text" value={formData.originalPrice} onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })} placeholder="399.99" />
              </div>
              <div className="form-group">
                <label className="form-label">Cantidad en Stock *</label>
                <input className="form-input" type="number" min="0" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })} required placeholder="10" />
              </div>
              <div className="form-group">
                <label className="form-label">Fecha de Adquisición</label>
                <input className="form-input" type="date" value={formData.acquisitionDate} onChange={(e) => setFormData({ ...formData, acquisitionDate: e.target.value })} />
              </div>
            </div>

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
              <div className="form-group">
                <label className="form-label">Galería de Imágenes</label>
                <input
                  className="form-input"
                  type="url"
                  value={formData.featureImages[0] || ""}
                  onChange={(e) => setFormData({ ...formData, featureImages: [e.target.value] })}
                  placeholder="https://example.com/image1.jpg"
                />
                <input
                  className="form-input"
                  type="url"
                  value={formData.featureImages[1] || ""}
                  onChange={(e) => setFormData({ ...formData, featureImages: [formData.featureImages[0] || "", e.target.value] })}
                  placeholder="https://example.com/image2.jpg"
                />
                <input
                  className="form-input"
                  type="url"
                  value={formData.featureImages[2] || ""}
                  onChange={(e) => setFormData({ ...formData, featureImages: [formData.featureImages[0] || "", formData.featureImages[1] || "", e.target.value] })}
                  placeholder="https://example.com/image3.jpg"
                />
                {formData.featureImages.length > 0 && (
                  <div className="form-image-preview">
                    {formData.featureImages.map(
                      (img, index) =>
                        img && (
                          <div key={index} className="form-image-item">
                            <img src={img} alt={`Feature ${index + 1}`} />
                          </div>
                        )
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Categoría *</label>
                <input className="form-input" type="text" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required placeholder="Ej: laptops" />
              </div>
              <div className="form-group">
                <label className="form-label">Subcategoría *</label>
                <input className="form-input" type="text" value={formData.subcategory} onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })} required placeholder="Ej: gaming" />
              </div>
              <div className="form-group">
                <label className="form-label">Marca</label>
                <input className="form-input" type="text" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} placeholder="Ej: Acer" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Especificaciones (JSON)</label>
              <textarea
                className="form-input form-textarea"
                value={JSON.stringify(formData.specs, null, 2)}
                onChange={(e) => {
                  try {
                    setFormData({ ...formData, specs: JSON.parse(e.target.value) });
                  } catch (err) {
                    // Ignore JSON parse errors while typing
                  }
                }}
                placeholder='{"color": "Rojo", "capacidad": "1TB", "procesador": "Intel Core i7"}'
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <input type="checkbox" checked={formData.isNew} onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })} />
                  🆕 Nuevo
                </label>
              </div>
              <div className="form-group">
                <label className="form-label">
                  <input type="checkbox" checked={formData.isPopular} onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })} />⭐ Popular
                </label>
              </div>
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
          <button className="form-btn" type="button" onClick={handleSubmit}>
            {mode === "add" ? "✅ Agregar Producto" : "💾 Guardar Cambios"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
