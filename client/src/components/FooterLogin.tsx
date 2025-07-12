import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const FooterLogin: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const success = await login(email, password);
      if (success) {
        setEmail("");
        setPassword("");
        setShowForm(false);
      } else {
        setError("Credenciales inválidas");
      }
    } catch (err) {
      setError("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  if (showForm) {
    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="px-2 py-1 text-xs border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          required
          className="px-2 py-1 text-xs border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
        <button type="submit" disabled={loading} className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
          {loading ? "..." : "Entrar"}
        </button>
        <button type="button" onClick={() => setShowForm(false)} className="px-2 py-1 text-xs text-gray-400 hover:text-white">
          ×
        </button>
        {error && <span className="text-xs text-red-400 ml-2">{error}</span>}
      </form>
    );
  }

  return (
    <button onClick={() => setShowForm(true)} className="text-xs text-gray-400 hover:text-white transition-colors">
      Iniciar Sesión
    </button>
  );
};

export default FooterLogin;
