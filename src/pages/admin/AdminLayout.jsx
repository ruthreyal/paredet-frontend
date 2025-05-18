import React, { useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/admin.css";
import { useState } from "react";

const AdminLayout = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const [menuAbierto, setMenuAbierto] = useState(false);

  const handleCloseMenuIfMobile = () => {
    if (window.innerWidth < 992) {
      setMenuAbierto(false);
    }
  };
  

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
        <h4 className="text-white m-0">Panel Admin</h4>
        <button onClick={handleLogout} className="btn-cerrar-sesion">
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
            <li>
              <Link to="/admin" className="nav-link" onClick={handleCloseMenuIfMobile}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin/productos" className="nav-link" onClick={handleCloseMenuIfMobile}>
                Productos
              </Link>
            </li>
            <li>
              <Link to="/admin/pedidos" className="nav-link" onClick={handleCloseMenuIfMobile}>
                Pedidos
              </Link>
            </li>
            <li>
              <Link to="/admin/usuarios" className="nav-link" onClick={handleCloseMenuIfMobile}>
                Usuarios
              </Link>
            </li>
            <li>
              <Link to="/admin/categorias" className="nav-link" onClick={handleCloseMenuIfMobile}>
                Categorías
              </Link>
            </li>
            <li>
              <Link to="/" className="nav-link" onClick={handleCloseMenuIfMobile}>
                Ir a la web
              </Link>
            </li>
          </ul>
        </div>

        <div className="logout-wrapper text-center mt-auto d-none d-lg-block">
          <button onClick={handleLogout} className="btn-claro-inverso">
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
