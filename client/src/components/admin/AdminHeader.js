import React from "react";
import { useNavigate } from "react-router-dom";

function AdminHeader() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/admin-login");
  };

  return (
    <div
      style={{
        background: "#111",
        padding: "16px 25px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #333",
      }}
    >
      <div style={{ width: "100%", textAlign: "center" }}>
  <h3 style={{ color: "#f1c40f", margin: 0 }}>Admin Panel</h3>
</div>


      <button
        onClick={logout}
        style={{
          background: "#f1c40f",
          color: "#fff",
          border: "none",
          padding: "8px 14px",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default AdminHeader;
