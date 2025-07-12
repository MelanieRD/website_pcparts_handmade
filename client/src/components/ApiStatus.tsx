import React from "react";
import { useApiHealth } from "../hooks/useApi";

const ApiStatus: React.FC = () => {
  const { data: health, loading, error } = useApiHealth();

  if (loading) {
    return (
      <div
        style={{
          position: "fixed",
          top: "10px",
          right: "10px",
          padding: "8px 12px",
          borderRadius: "4px",
          fontSize: "12px",
          zIndex: 1000,
          backgroundColor: "#fbbf24",
          color: "#92400e",
        }}
      >
        🔄 Checking API...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          position: "fixed",
          top: "10px",
          right: "10px",
          padding: "8px 12px",
          borderRadius: "4px",
          fontSize: "12px",
          zIndex: 1000,
          backgroundColor: "#ef4444",
          color: "white",
        }}
      >
        ❌ API Error: {error}
      </div>
    );
  }

  if (health?.status === "healthy") {
    return (
      <div
        style={{
          position: "fixed",
          top: "10px",
          right: "10px",
          padding: "8px 12px",
          borderRadius: "4px",
          fontSize: "12px",
          zIndex: 1000,
          backgroundColor: "#10b981",
          color: "white",
        }}
      >
        ✅ API Connected
      </div>
    );
  }

  return null;
};

export default ApiStatus;
