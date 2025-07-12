import React, { useState } from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const initialCart: CartItem[] = [];

const Cart: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>(initialCart);

  const handleQuantity = (id: string, delta: number) => {
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item)));
  };

  const handleRemove = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const lines = cart.map((item) => `${item.name} x${item.quantity} - $${item.price * item.quantity}`).join("%0A");
    const url = `https://wa.me/?text=Pedido%20CyborgTech:%0A${lines}%0ATotal:%20$${total.toFixed(2)}`;
    window.open(url, "_blank");
  };

  return (
    <div>
      <Navigation />
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 32 }}>Carrito</h1>
        {cart.length === 0 ? (
          <div style={{ color: "#666", textAlign: "center" }}>Tu carrito está vacío.</div>
        ) : (
          <>
            <table style={{ width: "100%", marginBottom: 32 }}>
              <thead>
                <tr style={{ background: "#f8f9fa" }}>
                  <th style={{ padding: 12, textAlign: "left" }}>Producto</th>
                  <th style={{ padding: 12 }}>Cantidad</th>
                  <th style={{ padding: 12 }}>Precio</th>
                  <th style={{ padding: 12 }}></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id}>
                    <td style={{ padding: 12, display: "flex", alignItems: "center", gap: 16 }}>
                      <img src={item.image} alt={item.name} style={{ width: 60, borderRadius: 8, background: "#f1f1f1" }} />
                      {item.name}
                    </td>
                    <td style={{ padding: 12 }}>
                      <button onClick={() => handleQuantity(item.id, -1)} style={{ marginRight: 8 }}>
                        -
                      </button>
                      {item.quantity}
                      <button onClick={() => handleQuantity(item.id, 1)} style={{ marginLeft: 8 }}>
                        +
                      </button>
                    </td>
                    <td style={{ padding: 12 }}>${(item.price * item.quantity).toFixed(2)}</td>
                    <td style={{ padding: 12 }}>
                      <button onClick={() => handleRemove(item.id)} style={{ color: "#e53e3e", border: "none", background: "none", cursor: "pointer" }}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ textAlign: "right", fontSize: "1.2rem", fontWeight: 600, marginBottom: 24 }}>Total: ${total.toFixed(2)}</div>
            <button
              onClick={handleCheckout}
              style={{ padding: "0.75rem 2rem", background: "#25d366", color: "white", border: "none", borderRadius: 8, fontWeight: 600, fontSize: "1.1rem", cursor: "pointer" }}
            >
              Checkout por WhatsApp
            </button>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
