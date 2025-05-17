import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
    navigate("/");
  };

  const handleMobileProfileClick = () => {
    if (usuario) {
      toggleProfileMenu();
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      {/* NAVBAR DESKTOP */}
      <nav
        className="navbar navbar-expand-lg navbar-dark bg-dark px-4 shadow-sm d-none d-lg-flex justify-content-between align-items-center sticky-top"
        style={{ position: "relative" }}
      >
        <ul className="navbar-nav d-flex justify-content-evenly flex-grow-1">
          <li className="nav-item">
            <Link className="nav-link" to="#">
              Papeles Pintados
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="#">
              Fotomurales
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="#">
              Colecciones
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="#">
              La Empresa
            </Link>
          </li>
        </ul>

        <ul className="navbar-nav align-items-center gap-3 ms-3">
          {usuario ? (
            <li className="nav-item dropdown position-relative">
              <div
                className="nav-link dropdown-toggle d-flex align-items-center"
                role="button"
                onClick={() => {
                  console.log("👤 Click en Hola, admin");
                  toggleProfileMenu();
                }}
                style={{ cursor: "pointer" }}
              >
                <i className="bi bi-person"></i>
                <span className="ms-1">¡Hola, {usuario.nombre}!</span>
              </div>

              {isProfileMenuOpen && (
                <ul
                  className="dropdown-menu show"
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    backgroundColor: "#1c1c1c",
                    border: "none",
                    borderRadius: "8px",
                    zIndex: 1050,
                    minWidth: "180px",
                    padding: "0.5rem",
                  }}
                >
                  <li>
                    <Link className="dropdown-item text-white" to="/perfil">
                      Mi perfil
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item text-white" to="#">
                      Favoritos
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item text-white" to="#">
                      Mis pedidos
                    </Link>
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      Cerrar sesión
                    </button>
                  </li>
                </ul>
              )}
            </li>
          ) : (
            <li className="nav-item">
              <Link className="nav-link" to="/login">
                <i className="bi bi-person"></i>
              </Link>
            </li>
          )}

          <li className="nav-item">
            <Link className="nav-link" to="#">
              <i className="bi bi-cart"></i>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="#">
              <i className="bi bi-search"></i>
            </Link>
          </li>
        </ul>
      </nav>

      {/* NAVBAR MOBILE */}
      <nav className="navbar navbar-dark custom-navbar-mobile d-flex d-lg-none justify-content-between align-items-center px-3 py-2">
        <button
          className={`menu-toggle ${isOpen ? "open" : ""}`}
          onClick={toggleMenu}
          aria-label="Abrir menú"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <Link
          to="/"
          className="fw-bold text-uppercase text-white mx-auto logo-text text-decoration-none"
          aria-label="Ir a la página de inicio"
        >
          PAREDET
        </Link>

        <div className="d-flex align-items-center gap-2 position-relative">
          <i
            className="bi bi-search text-white fs-5"
            role="button"
            aria-label="Buscar"
          ></i>
        </div>
      </nav>

      {/* MENÚ DESPLEGABLE MOBILE */}
      <div
        className={`mobile-menu ${isOpen ? "show" : ""}`}
        role="navigation"
        aria-label="Menú móvil"
      >
        <ul className="navbar-nav px-4 pt-3">
          <li className="nav-item mb-3 d-flex justify-content-between">
            <Link
              className="nav-link text-white d-flex align-items-center gap-2"
              to="/"
              onClick={toggleMenu}
            >
              <i className="bi bi-house"></i> Inicio
            </Link>
            <Link
              className="nav-link text-white d-flex align-items-center gap-2"
              to={usuario ? "/perfil" : "/login"}
              onClick={toggleMenu}
            >
              <i className="bi bi-person"></i> Mi cuenta
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link className="nav-link text-white" to="#" onClick={toggleMenu}>
              Papeles Pintados
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link className="nav-link text-white" to="#" onClick={toggleMenu}>
              Fotomurales
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link className="nav-link text-white" to="#" onClick={toggleMenu}>
              Colecciones
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link className="nav-link text-white" to="#" onClick={toggleMenu}>
              La Empresa
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
