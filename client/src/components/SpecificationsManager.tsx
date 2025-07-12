import React, { useState } from "react";
import "./FormStyles.css";

interface SpecificationsManagerProps {
  specs: Record<string, string>;
  onChange: (specs: Record<string, string>) => void;
  title?: string;
}

const SpecificationsManager: React.FC<SpecificationsManagerProps> = ({ specs, onChange, title = "Especificaciones" }) => {
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const addSpec = () => {
    if (newKey.trim() && newValue.trim()) {
      onChange({ ...specs, [newKey.trim()]: newValue.trim() });
      setNewKey("");
      setNewValue("");
    }
  };

  const removeSpec = (key: string) => {
    const newSpecs = { ...specs };
    delete newSpecs[key];
    onChange(newSpecs);
  };

  const startEdit = (key: string, value: string) => {
    setEditingKey(key);
    setEditValue(value);
  };

  const saveEdit = () => {
    if (editingKey && editValue.trim()) {
      const newSpecs = { ...specs };
      newSpecs[editingKey] = editValue.trim();
      onChange(newSpecs);
      setEditingKey(null);
      setEditValue("");
    }
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setEditValue("");
  };

  const specsArray = Object.entries(specs);

  return (
    <div className="form-group">
      <label className="form-label">{title}</label>

      {/* Input para agregar nueva especificación */}
      <div className="specs-input-container">
        <input
          className="form-input"
          type="text"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          placeholder="Ej: Procesador"
          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSpec())}
        />
        <input
          className="form-input"
          type="text"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder="Ej: Intel Core i7-12700K"
          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSpec())}
        />
        <button type="button" className="form-btn form-btn-small" onClick={addSpec} disabled={!newKey.trim() || !newValue.trim()}>
          ➕ Agregar
        </button>
      </div>

      {/* Lista de especificaciones */}
      {specsArray.length > 0 && (
        <div className="specs-list">
          {specsArray.map(([key, value]) => (
            <div key={key} className="specs-item">
              {editingKey === key ? (
                <div className="specs-edit">
                  <span className="specs-key">{key}:</span>
                  <input
                    className="form-input"
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), saveEdit())}
                  />
                  <button type="button" className="form-btn form-btn-small" onClick={saveEdit}>
                    💾
                  </button>
                  <button type="button" className="form-btn form-btn-small" onClick={cancelEdit}>
                    ❌
                  </button>
                </div>
              ) : (
                <div className="specs-display">
                  <span className="specs-key">{key}:</span>
                  <span className="specs-value">{value}</span>
                  <div className="specs-actions">
                    <button type="button" className="form-btn form-btn-small" onClick={() => startEdit(key, value)} title="Editar">
                      ✏️
                    </button>
                    <button type="button" className="form-btn form-btn-small" onClick={() => removeSpec(key)} title="Eliminar">
                      🗑️
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {specsArray.length === 0 && (
        <div className="specs-empty">
          <p>No hay especificaciones. Agrega especificaciones usando los campos de arriba.</p>
          <div className="specs-examples">
            <h4>Ejemplos de especificaciones:</h4>
            <ul>
              <li>
                <strong>Procesador:</strong> Intel Core i7-12700K
              </li>
              <li>
                <strong>Memoria RAM:</strong> 16GB DDR4 3200MHz
              </li>
              <li>
                <strong>Almacenamiento:</strong> 1TB SSD NVMe
              </li>
              <li>
                <strong>Tarjeta Gráfica:</strong> NVIDIA RTX 3070
              </li>
              <li>
                <strong>Pantalla:</strong> 15.6" Full HD 144Hz
              </li>
              <li>
                <strong>Sistema Operativo:</strong> Windows 11 Pro
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Vista JSON (solo lectura) */}
      {specsArray.length > 0 && (
        <div className="specs-json-view">
          <details>
            <summary>Ver JSON de especificaciones</summary>
            <pre className="specs-json">{JSON.stringify(specs, null, 2)}</pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default SpecificationsManager;
