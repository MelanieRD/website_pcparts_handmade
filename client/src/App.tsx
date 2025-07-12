import "./App.css";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Handmade from "./pages/Handmade";
import Ensambles from "./pages/Ensambles";
import Contacto from "./pages/Contacto";
import Admin from "./pages/Admin";
import ApiStatus from "./components/ApiStatus";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./components/CartContext";
import { I18nProvider } from "./hooks/useI18n";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <ApiStatus />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/pcshop" element={<Products />} />
              <Route path="/handmade" element={<Handmade />} />
              <Route path="/ensambles" element={<Ensambles />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </I18nProvider>
  );
}

export default App;
