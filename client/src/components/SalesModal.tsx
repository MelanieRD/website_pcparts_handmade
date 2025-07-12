import React, { useState } from "react";
import type { Product, HandmadeProduct, Build } from "../services/api";
import "./FormStyles.css";

interface SalesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSale: (productId: string, quantity: number, saleData: any) => Promise<void>;
  product: Product | HandmadeProduct | Build | null;
  productType: "product" | "handmade" | "build";
}

const SalesModal: React.FC<SalesModalProps> = ({ isOpen, onClose, onSale, product, productType }) => {
  const [quantity, setQuantity] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("efectivo");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !product) return null;

  const currentStock = product.stock || 0;
  const unitPrice = parseFloat(product.price);
  const originalPrice = parseFloat(product.originalPrice || product.price);
  const subtotal = unitPrice * quantity;
  const discountAmount = (subtotal * discount) / 100;
  const totalPrice = subtotal - discountAmount;
  const canSell = currentStock >= quantity && quantity > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSell) return;

    setLoading(true);
    setError("");

    try {
      const saleData = {
        customerName,
        customerEmail,
        customerPhone,
        paymentMethod,
        notes,
        saleDate: new Date().toISOString(),
        totalPrice: totalPrice.toFixed(2),
        discount: discount > 0 ? discount : undefined,
        discountAmount: discountAmount.toFixed(2),
        subtotal: subtotal.toFixed(2),
        originalPrice: originalPrice.toFixed(2),
      };

      await onSale(product.id, quantity, saleData);
      onClose();
    } catch (err: any) {
      setError("Error al procesar la venta: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setQuantity(1);
    setDiscount(0);
    setCustomerName("");
    setCustomerEmail("");
    setCustomerPhone("");
    setPaymentMethod("efectivo");
    setNotes("");
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="form-modal-bg">
      <div className="form-container sales-modal">
        <div className="form-header">
          <h2 className="form-title">💰 Registrar Venta</h2>
          <button className="form-close-btn" onClick={handleClose}>
            ✕
          </button>
        </div>

        <div className="form-body">
          {/* Información del producto */}
          <div className="product-info">
            <h3>Producto a vender:</h3>
            <div className="product-details">
              <div className="product-image">
                <img src={product.thumbnailImage} alt={product.name.es || product.name.en} />
              </div>
              <div className="product-text">
                <h4>{product.name.es || product.name.en}</h4>
                <p>
                  <strong>Categoría:</strong> {product.category}
                </p>
                <p>
                  <strong>Precio unitario:</strong> ${product.price}
                </p>
                {product.originalPrice && product.originalPrice !== product.price && (
                  <p>
                    <strong>Precio base:</strong> ${product.originalPrice}
                  </p>
                )}
                <p>
                  <strong>Stock disponible:</strong> {currentStock} unidades
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {error && <div className="form-error">{error}</div>}

            {/* Cantidad y descuento */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Cantidad a vender *</label>
                <input className="form-input" type="number" min="1" max={currentStock} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} required />
                <div className="form-help">Stock disponible: {currentStock}</div>
              </div>
              <div className="form-group">
                <label className="form-label">Descuento (%)</label>
                <input className="form-input" type="number" min="0" max="100" step="0.01" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} placeholder="0" />
                <div className="form-help">Descuento máximo: 100%</div>
              </div>
            </div>

            {/* Información del cliente */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nombre del Cliente *</label>
                <input className="form-input" type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required placeholder="Nombre completo" />
              </div>
              <div className="form-group">
                <label className="form-label">Email del Cliente</label>
                <input className="form-input" type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="cliente@email.com" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Teléfono del Cliente</label>
                <input className="form-input" type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="+1234567890" />
              </div>
              <div className="form-group">
                <label className="form-label">Método de Pago *</label>
                <select className="form-input" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} required>
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                  <option value="transferencia">Transferencia Bancaria</option>
                  <option value="paypal">PayPal</option>
                  <option value="crypto">Criptomonedas</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Notas adicionales</label>
              <textarea className="form-input form-textarea" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Información adicional sobre la venta..." rows={3} />
            </div>

            {/* Resumen de la venta */}
            <div className="sale-summary">
              <h4>Resumen de la Venta:</h4>
              <div className="summary-item">
                <span>Producto:</span>
                <span>{product.name.es || product.name.en}</span>
              </div>
              <div className="summary-item">
                <span>Cantidad:</span>
                <span>{quantity}</span>
              </div>
              <div className="summary-item">
                <span>Precio unitario:</span>
                <span>${product.price}</span>
              </div>
              <div className="summary-item">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <>
                  <div className="summary-item discount">
                    <span>Descuento ({discount}%):</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                </>
              )}
              <div className="summary-item total">
                <span>Total a cobrar:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="summary-item">
                <span>Stock después de la venta:</span>
                <span>{currentStock - quantity}</span>
              </div>
              {product.originalPrice && product.originalPrice !== product.price && (
                <div className="summary-item">
                  <span>Precio base total:</span>
                  <span>${(originalPrice * quantity).toFixed(2)}</span>
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="form-btn-container">
          <button className="form-btn form-btn-cancel" type="button" onClick={handleClose}>
            ❌ Cancelar
          </button>
          <button className="form-btn" type="button" onClick={handleSubmit} disabled={!canSell || loading}>
            {loading ? "⏳ Procesando..." : "💰 Confirmar Venta"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesModal;
