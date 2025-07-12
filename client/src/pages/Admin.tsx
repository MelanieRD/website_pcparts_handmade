import React, { useState, useEffect } from "react";
import "./Admin.css";
import "../components/FormStyles.css";
import ProductForm from "../components/ProductForm";
import HandmadeForm from "../components/HandmadeForm";
import type { Product, HandmadeProduct, Build } from "../services/api";
import { apiService } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import AuthDebug from "../components/AuthDebug";

const TABS = ["Productos", "Handmade", "Builds"] as const;
type TabType = (typeof TABS)[number];

type ModalType = "none" | "product" | "handmade" | "build";

type FormMode = "add" | "edit";

const AdminPanel: React.FC = () => {
  const [tab, setTab] = useState<TabType>("Productos");
  const [modal, setModal] = useState<ModalType>("none");
  const [formMode, setFormMode] = useState<FormMode>("add");
  const [editItem, setEditItem] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [handmade, setHandmade] = useState<HandmadeProduct[]>([]);
  const [builds, setBuilds] = useState<Build[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token, user, isAdmin } = useAuth();

  // Cargar datos de cada tipo
  const loadAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [prods, hands, blds] = await Promise.all([apiService.getAllProducts(), apiService.getAllHandmade(), apiService.getAllBuilds ? apiService.getAllBuilds() : Promise.resolve([])]);
      setProducts(prods);
      setHandmade(hands);
      setBuilds(blds);
    } catch (err) {
      setError("Error al cargar datos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  // Handlers para agregar/editar
  const handleAdd = (type: ModalType) => {
    setFormMode("add");
    setEditItem(null);
    setModal(type);
  };

  const handleEdit = (type: ModalType, item: any) => {
    setFormMode("edit");
    setEditItem(item);
    setModal(type);
  };

  const handleCloseModal = () => {
    setModal("none");
    setEditItem(null);
  };

  // Handlers para submit
  const handleSubmitProduct = async (data: Omit<Product, "id">) => {
    if (!token) return setError("No tienes permisos de administrador");
    try {
      if (formMode === "add") await apiService.createProduct(data, token);
      else if (editItem) await apiService.updateProduct(editItem.id, data, token);
      await loadAll();
      handleCloseModal();
    } catch (err: any) {
      setError("Error al guardar producto: " + (err.message || err));
    }
  };

  const handleSubmitHandmade = async (data: Omit<HandmadeProduct, "id">) => {
    if (!token) return setError("No tienes permisos de administrador");
    try {
      if (formMode === "add") await apiService.createHandmade(data, token);
      else if (editItem) await apiService.updateHandmade(editItem.id, data, token);
      await loadAll();
      handleCloseModal();
    } catch (err: any) {
      setError("Error al guardar handmade: " + (err.message || err));
    }
  };
  // TODO: Implementar handleSubmitBuild

  // Handlers para eliminar
  const handleDelete = async (type: ModalType, id: string) => {
    if (!token) return setError("No tienes permisos de administrador");
    if (!window.confirm("¿Seguro que quieres eliminar este elemento?")) return;
    try {
      if (type === "product") await apiService.deleteProduct(id, token);
      if (type === "handmade") await apiService.deleteHandmade(id, token);
      if (type === "build" && apiService.deleteBuild) await apiService.deleteBuild(id, token);
      await loadAll();
    } catch (err) {
      setError("Error al eliminar");
    }
  };

  if (loading)
    return (
      <div className="admin-panel">
        <div className="admin-loading">Cargando datos del panel de administración...</div>
      </div>
    );

  if (!token || !user)
    return (
      <div className="admin-panel">
        <div className="error-message">Debes iniciar sesión para acceder al panel de administración.</div>
      </div>
    );

  if (!isAdmin)
    return (
      <div className="admin-panel">
        <div className="error-message">No tienes permisos de administrador para acceder a esta página.</div>
      </div>
    );

  // Render tabla según tab
  const renderTable = () => {
    if (tab === "Productos") {
      return (
        <>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name.es || p.name.en}</td>
                    <td>{p.category}</td>
                    <td>${p.price}</td>
                    <td>{p.stock ?? "-"}</td>
                    <td>{p.acquisitionDate ?? "-"}</td>
                    <td>
                      <button className="admin-btn" onClick={() => handleEdit("product", p)}>
                        Editar
                      </button>
                      <button className="admin-btn delete" onClick={() => handleDelete("product", p.id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="admin-btn add" onClick={() => handleAdd("product")}>
            ➕ Agregar Producto
          </button>
        </>
      );
    }

    if (tab === "Handmade") {
      return (
        <>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {handmade.map((h) => (
                  <tr key={h.id}>
                    <td>{h.name.es || h.name.en}</td>
                    <td>{h.category}</td>
                    <td>${h.price}</td>
                    <td>{h.stock ?? "-"}</td>
                    <td>{h.acquisitionDate ?? "-"}</td>
                    <td>
                      <button className="admin-btn" onClick={() => handleEdit("handmade", h)}>
                        Editar
                      </button>
                      <button className="admin-btn delete" onClick={() => handleDelete("handmade", h.id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="admin-btn add" onClick={() => handleAdd("handmade")}>
            ➕ Agregar Handmade
          </button>
        </>
      );
    }

    if (tab === "Builds") {
      return (
        <>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {builds.map((b) => (
                  <tr key={b.id}>
                    <td>{b.name.es || b.name.en}</td>
                    <td>{b.category}</td>
                    <td>${b.price}</td>
                    <td>{b.stock ?? "-"}</td>
                    <td>{b.acquisitionDate ?? "-"}</td>
                    <td>
                      <button className="admin-btn" onClick={() => handleEdit("build", b)}>
                        Editar
                      </button>
                      <button className="admin-btn delete" onClick={() => handleDelete("build", b.id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="admin-btn add" onClick={() => handleAdd("build")}>
            ➕ Agregar Build
          </button>
        </>
      );
    }
    return null;
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Panel de Administración</h1>
      </div>

      <div className="admin-content">
        <AuthDebug />
        {error && <div className="error-message">{error}</div>}

        <div className="admin-tabs">
          {TABS.map((t) => (
            <button key={t} className={`admin-tab${tab === t ? " active" : ""}`} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </div>

        {renderTable()}
      </div>

      {/* Modal de formulario dinámico */}
      {modal === "product" && <ProductForm product={formMode === "edit" ? editItem : null} isOpen={modal === "product"} onClose={handleCloseModal} onSubmit={handleSubmitProduct} mode={formMode} />}

      {modal === "handmade" && (
        <HandmadeForm handmade={formMode === "edit" ? editItem : null} isOpen={modal === "handmade"} onClose={handleCloseModal} onSubmit={handleSubmitHandmade} mode={formMode} />
      )}
      {/* TODO: Modal para builds */}
    </div>
  );
};

export default AdminPanel;
