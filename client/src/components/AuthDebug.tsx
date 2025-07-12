import React from "react";
import { useAuth } from "../contexts/AuthContext";

const AuthDebug: React.FC = () => {
  const { user, token, isAdmin, loading } = useAuth();

  if (loading) {
    return <div>Loading auth state...</div>;
  }

  return (
    <div
      style={{
        padding: "1rem",
        margin: "1rem",
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
        fontFamily: "monospace",
        fontSize: "12px",
      }}
    >
      <h3>Auth Debug Info:</h3>
      <div>
        <strong>Token:</strong> {token ? `${token.substring(0, 20)}...` : "null"}
      </div>
      <div>
        <strong>User:</strong> {user ? JSON.stringify(user, null, 2) : "null"}
      </div>
      <div>
        <strong>Is Admin:</strong> {isAdmin ? "true" : "false"}
      </div>
      <div>
        <strong>Loading:</strong> {loading ? "true" : "false"}
      </div>
      {token && (
        <div>
          <strong>Token Payload:</strong>
          <pre style={{ fontSize: "10px", overflow: "auto" }}>
            {(() => {
              try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                return JSON.stringify(payload, null, 2);
              } catch (e) {
                return "Could not parse token";
              }
            })()}
          </pre>
        </div>
      )}
    </div>
  );
};

export default AuthDebug;
