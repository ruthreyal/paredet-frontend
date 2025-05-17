import React, { useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/admin.css";

const AdminLayout = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="admin-container d-flex">
      <aside className="admin-sidebar d-flex flex-column justify-content-between p-3">
        <div>
          <h4 className="text-center mb-4">Panel Admin</h4>
          <ul className="nav flex-column">
            <li>
              <Link to="/admin" className="nav-link">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin/productos" className="nav-link">
                Productos
              </Link>
            </li>
            <li>
              <Link to="/admin/pedidos" className="nav-link">
                Pedidos
              </Link>
            </li>
            <li>
              <Link to="/admin/usuarios" className="nav-link">
                Usuarios
              </Link>
            </li>
            <li>
              <Link to="/admin/categorias" className="nav-link">
                Categorías
              </Link>
            </li>
            <li>
              <Link to="/" className="nav-link">
                Ir a la web
              </Link>
            </li>
          </ul>
        </div>

        <div className="logout-wrapper text-center mt-auto">
          <button
            onClick={handleLogout}
            className="btn-claro-inverso"
            aria-label="Cerrar sesión"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="admin-main p-4 flex-grow-1">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
