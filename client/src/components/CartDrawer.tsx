import React from "react";
import { useCart } from "./CartContext";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose }) => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const lines = cart.map((item) => `${item.name} x${item.quantity} - $${item.price * item.quantity}`).join("%0A");
    const url = `https://wa.me/?text=Pedido%20CyborgTech:%0A${lines}%0ATotal:%20$${total.toFixed(2)}`;
    window.open(url, "_blank");
  };

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.2)",
          zIndex: 1999,
        }}
      />
      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: 360,
          height: "100vh",
          background: "#fff",
          boxShadow: "-2px 0 16px rgba(0,0,0,0.15)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(.4,0,.2,1)",
          zIndex: 2000,
          display: "flex",
          flexDirection: "column",
        }}
        aria-hidden={!open}
      >
        <div style={{ padding: 24, borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 700, margin: 0 }}>Carrito</h2>
          <button onClick={onClose} style={{ fontSize: 24, background: "none", border: "none", cursor: "pointer" }}>
            ×
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {cart.length === 0 ? (
            <div style={{ color: "#666", textAlign: "center", marginTop: 48 }}>Tu carrito está vacío.</div>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                  <img src={item.image} alt={item.name} style={{ width: 60, borderRadius: 8, background: "#f1f1f1" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                    <div style={{ color: "#667eea", fontWeight: 600 }}>${item.price.toFixed(2)}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ width: 28, height: 28 }}>
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ width: 28, height: 28 }}>
                        +
                      </button>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} style={{ color: "#e53e3e", border: "none", background: "none", cursor: "pointer", fontSize: 18 }}>
                    🗑️
                  </button>
                </div>
              ))}
              <button onClick={clearCart} style={{ color: "#e53e3e", background: "none", border: "none", cursor: "pointer", marginBottom: 16 }}>
                Vaciar carrito
              </button>
            </>
          )}
        </div>
        <div style={{ padding: 24, borderTop: "1px solid #eee" }}>
          <div style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: 12 }}>Total: ${total.toFixed(2)}</div>
          <button
            onClick={handleCheckout}
            style={{ width: "100%", padding: "0.75rem 0", background: "#25d366", color: "white", border: "none", borderRadius: 8, fontWeight: 600, fontSize: "1.1rem", cursor: "pointer" }}
          >
            Checkout por WhatsApp
          </button>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
