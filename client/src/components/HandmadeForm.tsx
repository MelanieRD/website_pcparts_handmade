import React, { useState, useEffect } from "react";
import type { HandmadeProduct } from "../services/api";

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
    image: "",
    images: [] as string[],
    category: "",
    subcategory: "",
    specs: {} as Record<string, string>,
    isOffer: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newSpecKey, setNewSpecKey] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");
  const [activeTab, setActiveTab] = useState<"basic" | "details" | "media" | "specs">("basic");

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
        image: handmade.image,
        images: handmade.images || [],
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
        image: "",
        images: [],
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

  const addImage = () => {
    if (newImageUrl.trim()) {
      setFormData({ ...formData, images: [...formData.images, newImageUrl.trim()] });
      setNewImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) });
  };

  const addSpec = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      setFormData({
        ...formData,
        specs: { ...formData.specs, [newSpecKey.trim()]: newSpecValue.trim() },
      });
      setNewSpecKey("");
      setNewSpecValue("");
    }
  };

  const removeSpec = (key: string) => {
    const newSpecs = { ...formData.specs };
    delete newSpecs[key];
    setFormData({ ...formData, specs: newSpecs });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">{mode === "add" ? "🎨 Agregar Producto Handmade" : "✏️ Editar Producto Handmade"}</h2>
              <p className="text-purple-100 mt-1">{mode === "add" ? "Completa la información del nuevo producto artesanal" : "Modifica los datos del producto handmade"}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20 transition-all"
            >
              ×
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 bg-gray-50">
          <nav className="flex space-x-8 px-6">
            {[
              { id: "basic", label: "📝 Información Básica", icon: "📝" },
              { id: "details", label: "🏷️ Detalles", icon: "🏷️" },
              { id: "media", label: "🖼️ Media", icon: "🖼️" },
              { id: "specs", label: "⚙️ Especificaciones", icon: "⚙️" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id ? "border-purple-500 text-purple-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Form Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Tab */}
            {activeTab === "basic" && (
              <div className="space-y-6">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-purple-900 mb-4">Información Básica</h3>

                  {/* Nombre en múltiples idiomas */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">🇪🇸 Nombre (Español) *</label>
                      <input
                        type="text"
                        value={formData.name.es}
                        onChange={(e) => setFormData({ ...formData, name: { ...formData.name, es: e.target.value } })}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="Ej: Collar de Plata Artesanal"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">🇺🇸 Nombre (English) *</label>
                      <input
                        type="text"
                        value={formData.name.en}
                        onChange={(e) => setFormData({ ...formData, name: { ...formData.name, en: e.target.value } })}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="Ex: Handcrafted Silver Necklace"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">🇫🇷 Nombre (Français) *</label>
                      <input
                        type="text"
                        value={formData.name.fr}
                        onChange={(e) => setFormData({ ...formData, name: { ...formData.name, fr: e.target.value } })}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="Ex: Collier en Argent Artisanal"
                      />
                    </div>
                  </div>

                  {/* Descripción corta en múltiples idiomas */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">🇪🇸 Descripción Corta (Español) *</label>
                      <textarea
                        value={formData.description.es}
                        onChange={(e) => setFormData({ ...formData, description: { ...formData.description, es: e.target.value } })}
                        required
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                        placeholder="Descripción breve del producto"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">🇺🇸 Descripción Corta (English) *</label>
                      <textarea
                        value={formData.description.en}
                        onChange={(e) => setFormData({ ...formData, description: { ...formData.description, en: e.target.value } })}
                        required
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                        placeholder="Short product description"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">🇫🇷 Descripción Corta (Français) *</label>
                      <textarea
                        value={formData.description.fr}
                        onChange={(e) => setFormData({ ...formData, description: { ...formData.description, fr: e.target.value } })}
                        required
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                        placeholder="Description courte du produit"
                      />
                    </div>
                  </div>

                  {/* Descripción larga en múltiples idiomas */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">🇪🇸 Descripción Larga (Español) *</label>
                      <textarea
                        value={formData.longDescription.es}
                        onChange={(e) => setFormData({ ...formData, longDescription: { ...formData.longDescription, es: e.target.value } })}
                        required
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                        placeholder="Descripción detallada del producto"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">🇺🇸 Descripción Larga (English) *</label>
                      <textarea
                        value={formData.longDescription.en}
                        onChange={(e) => setFormData({ ...formData, longDescription: { ...formData.longDescription, en: e.target.value } })}
                        required
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                        placeholder="Detailed product description"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">🇫🇷 Descripción Larga (Français) *</label>
                      <textarea
                        value={formData.longDescription.fr}
                        onChange={(e) => setFormData({ ...formData, longDescription: { ...formData.longDescription, fr: e.target.value } })}
                        required
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                        placeholder="Description détaillée du produit"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Details Tab */}
            {activeTab === "details" && (
              <div className="space-y-6">
                <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-pink-900 mb-4">Detalles del Producto</h3>

                  {/* Precios */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">💰 Precio *</label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-500">€</span>
                        <input
                          type="text"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          required
                          className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                          placeholder="89.99"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">💸 Precio Original (opcional)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-500">€</span>
                        <input
                          type="text"
                          value={formData.originalPrice}
                          onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                          className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                          placeholder="119.99"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Categorías */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">📂 Categoría *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                      >
                        <option value="">Seleccionar categoría</option>
                        <option value="jewelry">💍 Joyería</option>
                        <option value="clothing">👕 Ropa</option>
                        <option value="home">🏠 Hogar</option>
                        <option value="art">🎨 Arte</option>
                        <option value="accessories">👜 Accesorios</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">🏷️ Subcategoría *</label>
                      <input
                        type="text"
                        value={formData.subcategory}
                        onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                        placeholder="Collares, Pulseras, etc."
                      />
                    </div>
                  </div>

                  {/* Estado de oferta */}
                  <div className="mt-6">
                    <label className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-pink-300 transition-all cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isOffer}
                        onChange={(e) => setFormData({ ...formData, isOffer: e.target.checked })}
                        className="mr-3 w-5 h-5 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900">🏷️ Oferta</span>
                        <p className="text-xs text-gray-500">Producto en descuento</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Media Tab */}
            {activeTab === "media" && (
              <div className="space-y-6">
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-indigo-900 mb-4">Imágenes del Producto</h3>

                  {/* Imagen principal */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">🖼️ URL de la imagen principal *</label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="https://example.com/main-image.jpg"
                    />
                    {formData.image && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-2">Vista previa:</p>
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Imágenes adicionales */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">📸 Imágenes adicionales</label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="url"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="https://example.com/image.jpg"
                      />
                      <button type="button" onClick={addImage} className="px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                        ➕ Agregar
                      </button>
                    </div>
                    {formData.images.length > 0 && (
                      <div className="space-y-2">
                        {formData.images.map((image, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                            <img
                              src={image}
                              alt={`Preview ${index + 1}`}
                              className="w-12 h-12 object-cover rounded border border-gray-300"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                            <span className="text-sm text-gray-600 truncate flex-1">{image}</span>
                            <button type="button" onClick={() => removeImage(index)} className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors">
                              🗑️ Eliminar
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Specs Tab */}
            {activeTab === "specs" && (
              <div className="space-y-6">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-orange-900 mb-4">Especificaciones del Producto</h3>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">⚙️ Agregar Especificación</label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={newSpecKey}
                        onChange={(e) => setNewSpecKey(e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="Material"
                      />
                      <input
                        type="text"
                        value={newSpecValue}
                        onChange={(e) => setNewSpecValue(e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="Plata 925"
                      />
                      <button type="button" onClick={addSpec} className="px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium">
                        ➕ Agregar
                      </button>
                    </div>
                  </div>

                  {Object.keys(formData.specs).length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-700">Especificaciones actuales:</h4>
                      {Object.entries(formData.specs).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                          <div className="flex-1">
                            <span className="text-sm font-medium text-gray-900">{key}:</span>
                            <span className="text-sm text-gray-600 ml-2">{value}</span>
                          </div>
                          <button type="button" onClick={() => removeSpec(key)} className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors">
                            🗑️ Eliminar
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation and Submit */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <div className="flex space-x-2">
                {activeTab !== "basic" && (
                  <button
                    type="button"
                    onClick={() => {
                      const tabs = ["basic", "details", "media", "specs"];
                      const currentIndex = tabs.indexOf(activeTab);
                      setActiveTab(tabs[currentIndex - 1] as any);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    ← Anterior
                  </button>
                )}
                {activeTab !== "specs" && (
                  <button
                    type="button"
                    onClick={() => {
                      const tabs = ["basic", "details", "media", "specs"];
                      const currentIndex = tabs.indexOf(activeTab);
                      setActiveTab(tabs[currentIndex + 1] as any);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Siguiente →
                  </button>
                )}
              </div>

              <div className="flex space-x-3">
                <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Guardando...
                    </span>
                  ) : (
                    <span className="flex items-center">{mode === "add" ? "🎨 Agregar Producto" : "💾 Guardar Cambios"}</span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HandmadeForm;
