import React from "react";
import "../components/FormStyles.css";
import ProductForm from "../components/ProductForm";
import type { Product } from "../services/api";
import { apiService } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import AuthDebug from "../components/AuthDebug";

const AdminPanel: React.FC = () => {
  const [isProductFormOpen, setProductFormOpen] = React.useState(false);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const { token, user, isAdmin } = useAuth();

  React.useEffect(() => {
    console.log("Admin Panel - Token:", token);
    console.log("Admin Panel - User:", user);
    console.log("Admin Panel - IsAdmin:", isAdmin);
    loadProducts();
  }, [token, user, isAdmin]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const productsData = await apiService.getAllProducts();
      setProducts(productsData);
    } catch (err) {
      setError("Error al cargar productos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (productData: Omit<Product, "id">) => {
    try {
      console.log("handleAddProduct - Token:", token);
      console.log("handleAddProduct - User:", user);
      console.log("handleAddProduct - IsAdmin:", isAdmin);
      console.log("handleAddProduct - ProductData:", productData);

      if (!token) {
        setError("No tienes permisos de administrador - Token no encontrado");
        return;
      }

      if (!isAdmin) {
        setError("No tienes permisos de administrador - Usuario no es admin");
        return;
      }

      console.log("handleAddProduct - Calling API with token:", token);
      await apiService.createProduct(productData, token);
      await loadProducts(); // Recargar la lista
      setProductFormOpen(false);
      setError(""); // Clear any previous errors
    } catch (err: any) {
      console.error("handleAddProduct - Error:", err);
      if (err.message?.includes("401")) {
        setError("Error de autenticación: Token inválido o expirado. Por favor, inicia sesión nuevamente.");
      } else if (err.message?.includes("403")) {
        setError("Error de permisos: No tienes permisos de administrador.");
      } else {
        setError(`Error al crear el producto: ${err.message || "Error desconocido"}`);
      }
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!token) {
      setError("No tienes permisos de administrador");
      return;
    }

    if (window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      try {
        await apiService.deleteProduct(id, token);
        await loadProducts(); // Recargar la lista
      } catch (err) {
        setError("Error al eliminar el producto");
        console.error(err);
      }
    }
  };

  if (loading) {
    return <div className="admin-panel">Cargando productos...</div>;
  }

  // Check if user is authenticated and is admin
  if (!token || !user) {
    return (
      <div className="admin-panel">
        <div className="error-message">Debes iniciar sesión para acceder al panel de administración.</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="admin-panel">
        <div className="error-message">No tienes permisos de administrador para acceder a esta página.</div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">Panel de Administración</div>
      <AuthDebug />
      {error && <div className="error-message">{error}</div>}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Fecha Adquisición</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name.es || product.name.en}</td>
              <td>{product.category}</td>
              <td>${product.price}</td>
              <td>{product.stock || "N/A"}</td>
              <td>{product.acquisitionDate || "N/A"}</td>
              <td>
                <button className="admin-btn">Editar</button>
                <button className="admin-btn" onClick={() => handleDeleteProduct(product.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="admin-btn" onClick={() => setProductFormOpen(true)}>
        Agregar Producto
      </button>
      <button
        className="admin-btn"
        onClick={async () => {
          try {
            console.log("Testing API connection...");
            const health = await apiService.healthCheck();
            console.log("Health check result:", health);
            alert(`API is healthy: ${JSON.stringify(health)}`);
          } catch (err) {
            console.error("Health check failed:", err);
            alert(`API health check failed: ${err}`);
          }
        }}
      >
        Test API Connection
      </button>
      <button
        className="admin-btn"
        onClick={async () => {
          if (!token) {
            alert("No token available");
            return;
          }
          try {
            console.log("Testing authentication...");
            const user = await apiService.testAuth(token);
            alert(`Auth test successful: ${JSON.stringify(user)}`);
          } catch (err) {
            console.error("Auth test failed:", err);
            alert(`Auth test failed: ${err}`);
          }
        }}
      >
        Test Authentication
      </button>
      <button
        className="admin-btn"
        onClick={async () => {
          if (!token) {
            alert("No token available");
            return;
          }
          try {
            console.log("Testing admin access...");
            const result = await apiService.testAdminAccess(token);
            alert(`Admin access test successful: ${JSON.stringify(result)}`);
          } catch (err) {
            console.error("Admin access test failed:", err);
            alert(`Admin access test failed: ${err}`);
          }
        }}
      >
        Test Admin Access
      </button>
      <button
        className="admin-btn"
        onClick={() => {
          console.log("=== IMMEDIATE TOKEN DEBUG ===");
          console.log("Token from context:", token);
          console.log("User from context:", user);
          console.log("IsAdmin from context:", isAdmin);
          if (token) {
            try {
              const parts = token.split(".");
              console.log("Token parts count:", parts.length);
              if (parts.length === 3) {
                const payload = JSON.parse(atob(parts[1]));
                console.log("Token payload:", payload);
                console.log("Token role:", payload.role);
                console.log("Token exp:", payload.exp);
                console.log("Current time:", Date.now() / 1000);
                console.log("Is expired:", payload.exp < Date.now() / 1000);
              }
            } catch (e) {
              console.error("Error parsing token:", e);
            }
          }
          alert("Check console for token debug info");
        }}
      >
        Debug Token
      </button>
      <ProductForm isOpen={isProductFormOpen} onClose={() => setProductFormOpen(false)} onSubmit={handleAddProduct} mode="add" />
    </div>
  );
};

export default AdminPanel;
