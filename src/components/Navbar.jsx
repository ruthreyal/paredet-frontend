import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleProfileClick = () => {
    if (usuario) {
      navigate("/perfil");
    } else {
      navigate("/login");
    }
  };

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

const toggleProfileMenu = () => {
  setIsProfileMenuOpen(!isProfileMenuOpen);
};

const handleLogout = () => {
  logout();  // Usando tu logout del AuthContext
  setIsProfileMenuOpen(false);
};


  return (
    <>
      {/* NAVBAR DESKTOP */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 shadow-sm d-none d-lg-flex justify-content-between align-items-center">
        <ul className="navbar-nav d-flex justify-content-evenly flex-grow-1">
          <li className="nav-item">
            <Link className="nav-link" to="#">Papeles Pintados</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="#">Fotomurales</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="#">Colecciones</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="#">La Empresa</Link>
          </li>
        </ul>
        <ul className="navbar-nav align-items-center gap-3 ms-3">
          {usuario ? (
            <li className="nav-item dropdown">
              <div className="d-flex align-items-center">
                <Link
                  className="nav-link dropdown-toggle"
                  to="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person"></i>{" "}
                  <span className="ms-1">¡Hola, {usuario.nombre}!</span>
                </Link>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><Link className="dropdown-item" to="/perfil">Mi perfil</Link></li>
                  <li><Link className="dropdown-item" to="#">Favoritos</Link></li>
                  <li><Link className="dropdown-item" to="#">Mis pedidos</Link></li>
                  <li><button className="dropdown-item" onClick={logout}>Cerrar sesión</button></li>
                </ul>
              </div>
            </li>
          ) : (
            <li className="nav-item">
              <Link className="nav-link" to="/login"><i className="bi bi-person"></i></Link>
            </li>
          )}
          <li className="nav-item">
            <Link className="nav-link" to="#"><i className="bi bi-cart"></i></Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="#"><i className="bi bi-search"></i></Link>
          </li>
        </ul>
      </nav>

     {/* NAVBAR MOBILE */}
<nav className="navbar navbar-dark bg-black d-flex d-lg-none justify-content-between align-items-center px-3 py-2 position-relative">
  <button
    className={`menu-toggle ${isOpen ? "open" : ""}`}
    onClick={toggleMenu}
    aria-label="Toggle menu"
  >
    <span></span>
    <span></span>
    <span></span>
  </button>

  <span className="fw-bold text-uppercase text-white mx-auto logo-text">
    PAREDET
  </span>

  {/* Botón de usuario */}
  {usuario ? (
    <div className="d-flex align-items-center gap-2 position-relative">
      <i className="bi bi-person text-white fs-5" onClick={toggleProfileMenu} role="button"></i>
      <span className="text-white small">¡Hola, {usuario.nombre}!</span>

      {/* Menú desplegable del perfil */}
      {isProfileMenuOpen && (
        <div className="position-absolute end-0 mt-2 bg-white rounded shadow p-2" style={{ minWidth: "150px", zIndex: 999 }}>
          <ul className="list-unstyled mb-0">
            <li>
              <Link to="/perfil" className="dropdown-item" onClick={toggleProfileMenu}>
                Mi perfil
              </Link>
            </li>
            <li>
              <Link to="/favoritos" className="dropdown-item" onClick={toggleProfileMenu}>
                Favoritos
              </Link>
            </li>
            <li>
              <Link to="/pedidos" className="dropdown-item" onClick={toggleProfileMenu}>
                Mis pedidos
              </Link>
            </li>
            <li>
              <button className="dropdown-item text-danger" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  ) : (
    <i className="bi bi-person text-white fs-5" role="button"></i>
  )}
</nav>


      {/* MENÚ DESPLEGABLE MOBILE */}
      <div className={`mobile-menu ${isOpen ? "show" : ""}`}>
        <ul className="navbar-nav px-4 pt-3">
          <li className="nav-item mb-2">
            <Link className="nav-link text-white" to="#" onClick={toggleMenu}>Papeles Pintados</Link>
          </li>
          <li className="nav-item mb-2">
            <Link className="nav-link text-white" to="#" onClick={toggleMenu}>Fotomurales</Link>
          </li>
          <li className="nav-item mb-2">
            <Link className="nav-link text-white" to="#" onClick={toggleMenu}>Colecciones</Link>
          </li>
          <li className="nav-item mb-2">
            <Link className="nav-link text-white" to="#" onClick={toggleMenu}>La Empresa</Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
























