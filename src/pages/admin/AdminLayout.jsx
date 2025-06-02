import React, { useContext, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/admin.css";

const AdminLayout = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleCloseMenuIfMobile = () => {
    if (window.innerWidth < 992) {
      setMenuAbierto(false);
    }
  };

  // Rutas del panel de administración
  const rutasAdmin = [
    { path: "/admin", label: "Dashboard" },
    { path: "/admin/productos", label: "Productos" },
    { path: "/admin/pedidos", label: "Pedidos" },
    { path: "/admin/usuarios", label: "Usuarios" },
    { path: "/admin/categorias", label: "Categorías" },
    { path: "/admin/colecciones", label: "Colecciones" },
    { path: "/", label: "Ir a la web" },
  ];

  return (
    <div className="admin-container d-flex flex-column flex-lg-row">
      {/* Barra superior visible solo en móvil */}
      <div className="admin-topbar d-lg-none d-flex justify-content-between align-items-center px-3 py-2 w-100">
        <button
          className={`menu-toggle ${menuAbierto ? "open" : ""}`}
          onClick={() => setMenuAbierto(!menuAbierto)}
          aria-label="Abrir menú"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <h4 className="btn-outline-dark">Panel Admin</h4>
        <button onClick={handleLogout} className="btn btn-outline-light">
          Cerrar sesión
        </button>
      </div>

      {/* Sidebar (visible en desktop, menú deslizable en móvil) */}
      <aside
        className={`admin-sidebar ${
          menuAbierto ? "show d-flex" : "d-none"
        } d-lg-flex flex-column justify-content-between p-3`}
      >
        <div>
          <h4 className="text-center mb-4 d-none d-lg-block">Panel Admin</h4>
          <ul className="nav flex-column">
            {rutasAdmin.map(({ path, label }) => (
              <li key={path}>
                <Link
                  to={path}
                  className="nav-link"
                  onClick={handleCloseMenuIfMobile}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="logout-wrapper text-center mt-auto d-none d-lg-block">
          <button onClick={handleLogout} className="btn btn-outline-light">
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="admin-main p-4 flex-grow-1">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
