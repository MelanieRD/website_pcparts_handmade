import React, { useState, useEffect } from "react";
import type { Sale } from "../services/api";
import { apiService } from "../services/api";
import "./FormStyles.css";

interface SalesHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
}

const SalesHistory: React.FC<SalesHistoryProps> = ({ isOpen, onClose, token }) => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterProductType, setFilterProductType] = useState<string>("all");
  const [filterPaymentMethod, setFilterPaymentMethod] = useState<string>("all");

  useEffect(() => {
    if (isOpen && token) {
      loadSales();
    }
  }, [isOpen, token]);

  const loadSales = async () => {
    setLoading(true);
    setError("");
    try {
      const salesData = await apiService.getAllSales(token);
      setSales(salesData);
    } catch (err: any) {
      setError("Error al cargar las ventas: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  const filteredSales = sales.filter((sale) => {
    const matchesDate = !filterDate || sale.saleDate.startsWith(filterDate);
    const matchesType = filterProductType === "all" || sale.productType === filterProductType;
    const matchesPayment = filterPaymentMethod === "all" || sale.paymentMethod === filterPaymentMethod;
    return matchesDate && matchesType && matchesPayment;
  });

  const totalRevenue = filteredSales.reduce((sum, sale) => sum + parseFloat(sale.finalPrice), 0);
  const totalDiscounts = filteredSales.reduce((sum, sale) => {
    const discount = sale.discount ? parseFloat(sale.discount) : 0;
    return sum + discount;
  }, 0);
  const totalSales = filteredSales.length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: string) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  if (!isOpen) return null;

  return (
    <div className="form-modal-bg">
      <div className="form-container sales-history-modal">
        <div className="form-header">
          <h2 className="form-title">📊 Historial de Ventas</h2>
          <button className="form-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="form-body">
          {error && <div className="form-error">{error}</div>}

          {/* Estadísticas */}
          <div className="sales-stats">
            <div className="stat-item">
              <span className="stat-label">Total de Ventas:</span>
              <span className="stat-value">{totalSales}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Ingresos Totales:</span>
              <span className="stat-value revenue">{formatCurrency(totalRevenue.toString())}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Descuentos Totales:</span>
              <span className="stat-value discount">{formatCurrency(totalDiscounts.toString())}</span>
            </div>
          </div>

          {/* Filtros */}
          <div className="sales-filters">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Filtrar por Fecha</label>
                <input className="form-input" type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Tipo de Producto</label>
                <select className="form-input" value={filterProductType} onChange={(e) => setFilterProductType(e.target.value)}>
                  <option value="all">Todos</option>
                  <option value="product">Productos</option>
                  <option value="handmade">Handmade</option>
                  <option value="build">Builds</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Método de Pago</label>
                <select className="form-input" value={filterPaymentMethod} onChange={(e) => setFilterPaymentMethod(e.target.value)}>
                  <option value="all">Todos</option>
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="paypal">PayPal</option>
                  <option value="crypto">Criptomonedas</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tabla de ventas */}
          {loading ? (
            <div className="sales-loading">
              <div className="form-loading">Cargando historial de ventas...</div>
            </div>
          ) : (
            <div className="sales-table-container">
              {filteredSales.length > 0 ? (
                <table className="sales-table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Producto</th>
                      <th>Cliente</th>
                      <th>Cantidad</th>
                      <th>Precio Unit.</th>
                      <th>Subtotal</th>
                      <th>Descuento</th>
                      <th>Total</th>
                      <th>Pago</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSales.map((sale) => (
                      <tr key={sale.id}>
                        <td>{formatDate(sale.saleDate)}</td>
                        <td>
                          <div className="sale-product">
                            <span className="product-name">{sale.productName}</span>
                            <span className="product-type">{sale.productType}</span>
                          </div>
                        </td>
                        <td>
                          <div className="sale-customer">
                            <span className="customer-name">{sale.customerName}</span>
                            {sale.customerEmail && <span className="customer-email">{sale.customerEmail}</span>}
                          </div>
                        </td>
                        <td>{sale.quantity}</td>
                        <td>{formatCurrency(sale.unitPrice)}</td>
                        <td>{formatCurrency(sale.totalPrice)}</td>
                        <td>{sale.discount ? <span className="discount-badge">-{sale.discount}%</span> : <span>-</span>}</td>
                        <td className="final-price">{formatCurrency(sale.finalPrice)}</td>
                        <td>
                          <span className={`payment-method ${sale.paymentMethod}`}>{sale.paymentMethod}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="sales-empty">
                  <p>No se encontraron ventas con los filtros aplicados.</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="form-btn-container">
          <button className="form-btn" type="button" onClick={loadSales}>
            🔄 Actualizar
          </button>
          <button className="form-btn form-btn-cancel" type="button" onClick={onClose}>
            ❌ Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesHistory;
