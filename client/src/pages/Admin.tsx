import React, { useState, useEffect } from "react";
import "./Admin.css";
import "../components/FormStyles.css";
import ProductForm from "../components/ProductForm";
import HandmadeForm from "../components/HandmadeForm";
import BuildForm from "../components/BuildForm";
import SalesModal from "../components/SalesModal";
import SalesHistory from "../components/SalesHistory";
import type { Product, HandmadeProduct, Build, SaleRequest } from "../services/api";
import { apiService } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import AuthDebug from "../components/AuthDebug";

const TABS = ["Productos", "Handmade", "Builds", "Ventas"] as const;
type TabType = (typeof TABS)[number];

type ModalType = "none" | "product" | "handmade" | "build" | "sale" | "sales-history";

type FormMode = "add" | "edit";

const AdminPanel: React.FC = () => {
  const [tab, setTab] = useState<TabType>("Productos");
  const [modal, setModal] = useState<ModalType>("none");
  const [formMode, setFormMode] = useState<FormMode>("add");
  const [editItem, setEditItem] = useState<any>(null);
  const [saleItem, setSaleItem] = useState<any>(null);
  const [saleType, setSaleType] = useState<"product" | "handmade" | "build">("product");
  const [products, setProducts] = useState<Product[]>([]);
  const [handmade, setHandmade] = useState<HandmadeProduct[]>([]);
  const [builds, setBuilds] = useState<Build[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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

  const handleSale = (type: "product" | "handmade" | "build", item: any) => {
    setSaleType(type);
    setSaleItem(item);
    setModal("sale");
  };

  const handleSalesHistory = () => {
    setModal("sales-history");
  };

  const handleCloseModal = () => {
    setModal("none");
    setEditItem(null);
    setSaleItem(null);
  };

  // Handlers para submit
  const handleSubmitProduct = async (data: Omit<Product, "id">) => {
    if (!token) return setError("No tienes permisos de administrador");
    try {
      if (formMode === "add") {
        await apiService.createProduct(data, token);
        setSuccess("Producto agregado exitosamente");
      } else if (editItem) {
        await apiService.updateProduct(editItem.id, data, token);
        setSuccess("Producto actualizado exitosamente");
      }
      await loadAll();
      handleCloseModal();
    } catch (err: any) {
      setError("Error al guardar producto: " + (err.message || err));
    }
  };

  const handleSubmitHandmade = async (data: Omit<HandmadeProduct, "id">) => {
    if (!token) return setError("No tienes permisos de administrador");
    try {
      if (formMode === "add") {
        await apiService.createHandmade(data, token);
        setSuccess("Producto handmade agregado exitosamente");
      } else if (editItem) {
        await apiService.updateHandmade(editItem.id, data, token);
        setSuccess("Producto handmade actualizado exitosamente");
      }
      await loadAll();
      handleCloseModal();
    } catch (err: any) {
      setError("Error al guardar handmade: " + (err.message || err));
    }
  };

  const handleSubmitBuild = async (data: Omit<Build, "id">) => {
    if (!token) return setError("No tienes permisos de administrador");
    try {
      // TODO: Implementar cuando esté disponible en el backend
      setSuccess("Funcionalidad de builds en desarrollo");
      await loadAll();
      handleCloseModal();
    } catch (err: any) {
      setError("Error al guardar build: " + (err.message || err));
    }
  };

  // Handler para ventas mejorado
  const handleSaleSubmit = async (productId: string, quantity: number, saleData: any) => {
    if (!token) return setError("No tienes permisos de administrador");
    try {
      // Crear la venta usando la nueva API
      const saleRequest: SaleRequest = {
        productId,
        productType: saleType,
        quantity,
        discount: saleData.discount || 0,
        customerName: saleData.customerName,
        customerEmail: saleData.customerEmail,
        customerPhone: saleData.customerPhone,
        paymentMethod: saleData.paymentMethod,
        notes: saleData.notes,
      };

      // Intentar crear la venta en el backend
      try {
        await apiService.createSale(saleRequest, token);
        setSuccess("Venta registrada exitosamente en el sistema");
      } catch (backendError) {
        // Si falla el backend, actualizar stock localmente como fallback
        console.warn("Backend de ventas no disponible, actualizando stock localmente:", backendError);

        const currentItem =
          saleType === "product" ? products.find((p) => p.id === productId) : saleType === "handmade" ? handmade.find((h) => h.id === productId) : builds.find((b) => b.id === productId);

        if (!currentItem) {
          throw new Error("Producto no encontrado");
        }

        if ((currentItem.stock || 0) < quantity) {
          throw new Error("Stock insuficiente");
        }

        // Actualizar stock localmente
        const updatedStock = (currentItem.stock || 0) - quantity;

        if (saleType === "product") {
          await apiService.updateProduct(productId, { ...currentItem, stock: updatedStock }, token);
        } else if (saleType === "handmade") {
          await apiService.updateHandmade(productId, { ...currentItem, stock: updatedStock }, token);
        }

        setSuccess(`Venta registrada exitosamente. Stock actualizado: ${updatedStock} unidades`);
      }

      await loadAll();
      handleCloseModal();
    } catch (err: any) {
      setError("Error al procesar la venta: " + (err.message || err));
    }
  };

  // Handlers para eliminar
  const handleDelete = async (type: ModalType, id: string) => {
    if (!token) return setError("No tienes permisos de administrador");
    if (!window.confirm("¿Seguro que quieres eliminar este elemento?")) return;
    try {
      if (type === "product") await apiService.deleteProduct(id, token);
      if (type === "handmade") await apiService.deleteHandmade(id, token);
      if (type === "build" && apiService.deleteBuild) await apiService.deleteBuild(id, token);
      setSuccess("Elemento eliminado exitosamente");
      await loadAll();
    } catch (err) {
      setError("Error al eliminar");
    }
  };

  // Limpiar mensajes
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

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
                  <th>Precio Base</th>
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
                    <td>{p.originalPrice ? `$${p.originalPrice}` : "-"}</td>
                    <td className={p.stock === 0 ? "stock-empty" : p.stock && p.stock < 5 ? "stock-low" : ""}>{p.stock ?? 0}</td>
                    <td>{p.acquisitionDate ?? "-"}</td>
                    <td className="admin-actions">
                      <button className="admin-btn" onClick={() => handleEdit("product", p)} title="Editar">
                        ✏️
                      </button>
                      <button className="admin-btn sale" onClick={() => handleSale("product", p)} disabled={!p.stock || p.stock === 0} title="Vender">
                        💰
                      </button>
                      <button className="admin-btn delete" onClick={() => handleDelete("product", p.id)} title="Eliminar">
                        🗑️
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
                  <th>Precio Base</th>
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
                    <td>{h.originalPrice ? `$${h.originalPrice}` : "-"}</td>
                    <td className={h.stock === 0 ? "stock-empty" : h.stock && h.stock < 5 ? "stock-low" : ""}>{h.stock ?? 0}</td>
                    <td>{h.acquisitionDate ?? "-"}</td>
                    <td className="admin-actions">
                      <button className="admin-btn" onClick={() => handleEdit("handmade", h)} title="Editar">
                        ✏️
                      </button>
                      <button className="admin-btn sale" onClick={() => handleSale("handmade", h)} disabled={!h.stock || h.stock === 0} title="Vender">
                        💰
                      </button>
                      <button className="admin-btn delete" onClick={() => handleDelete("handmade", h.id)} title="Eliminar">
                        🗑️
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
                  <th>Precio Base</th>
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
                    <td>{b.originalPrice ? `$${b.originalPrice}` : "-"}</td>
                    <td className={b.stock === 0 ? "stock-empty" : b.stock && b.stock < 5 ? "stock-low" : ""}>{b.stock ?? 0}</td>
                    <td>{b.acquisitionDate ?? "-"}</td>
                    <td className="admin-actions">
                      <button className="admin-btn" onClick={() => handleEdit("build", b)} title="Editar">
                        ✏️
                      </button>
                      <button className="admin-btn sale" onClick={() => handleSale("build", b)} disabled={!b.stock || b.stock === 0} title="Vender">
                        💰
                      </button>
                      <button className="admin-btn delete" onClick={() => handleDelete("build", b.id)} title="Eliminar">
                        🗑️
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

    if (tab === "Ventas") {
      return (
        <>
          <div className="sales-overview">
            <div className="sales-actions">
              <button className="admin-btn" onClick={handleSalesHistory}>
                📊 Ver Historial de Ventas
              </button>
            </div>
            <div className="sales-info">
              <p>En esta sección puedes:</p>
              <ul>
                <li>📊 Ver el historial completo de ventas</li>
                <li>💰 Registrar nuevas ventas desde las tablas de productos</li>
                <li>📈 Analizar estadísticas de ventas</li>
                <li>🎯 Aplicar descuentos a las ventas</li>
              </ul>
            </div>
          </div>
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
        {success && <div className="success-message">{success}</div>}

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

      {modal === "build" && <BuildForm build={formMode === "edit" ? editItem : null} isOpen={modal === "build"} onClose={handleCloseModal} onSubmit={handleSubmitBuild} mode={formMode} />}

      {/* Modal de ventas */}
      {modal === "sale" && <SalesModal isOpen={modal === "sale"} onClose={handleCloseModal} onSale={handleSaleSubmit} product={saleItem} productType={saleType} />}

      {/* Modal de historial de ventas */}
      {modal === "sales-history" && token && <SalesHistory isOpen={modal === "sales-history"} onClose={handleCloseModal} token={token} />}
    </div>
  );
};

export default AdminPanel;
