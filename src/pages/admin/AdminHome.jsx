import React from "react";
import { Link, Outlet } from "react-router-dom";
import "../../styles/admin.css";

const AdminLayout = () => {
  return (
    <div className="admin-container d-flex">
      <aside className="admin-sidebar p-3">
        <h4 className="text-center mb-4">Panel Admin</h4>
        <ul className="nav flex-column">
          <li><Link to="/admin" className="nav-link">Dashboard</Link></li>
          <li><Link to="/admin/productos" className="nav-link">Productos</Link></li>
          <li><Link to="/admin/pedidos" className="nav-link">Pedidos</Link></li>
          <li><Link to="/admin/usuarios" className="nav-link">Usuarios</Link></li>
        </ul>
      </aside>
      <main className="admin-main p-4 flex-grow-1">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
