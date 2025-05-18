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
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 shadow-sm d-none d-lg-flex justify-content-between align-items-center sticky-top">
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
                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-oscuro">
                  <li>
                    <Link to="/perfil">Mi perfil</Link>
                  </li>
                  <li>
                    <Link to="/pedidos">Mis pedidos</Link>
                  </li>
                  {usuario.rolNombre === "ADMIN" && (
                    <li>
                      <Link to="/admin">Panel de administración</Link>
                    </li>
                  )}
                  <li>
                    <button onClick={handleLogout}>Cerrar sesión</button>
                  </li>
                </ul>
              </div>
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

      {/* CONTENEDOR NAVBAR + MENÚ */}
      <div className="navbar-mobile-wrapper d-lg-none">
        {/* NAVBAR MOBILE */}
        <nav className="navbar navbar-dark custom-navbar-mobile d-flex justify-content-between align-items-center px-3 py-2">
          <button
            className={`menu-toggle ${isOpen ? "open" : ""}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <Link
            to="/"
            className="logo-text text-white fw-bold text-uppercase mx-auto text-decoration-none"
            onClick={() => isOpen && toggleMenu()}
          >
            PAREDET
          </Link>

          <Link to="/buscar" className="text-white fs-5">
            <i className="bi bi-search"></i>
          </Link>
        </nav>

        {/* MENÚ DESPLEGABLE MOBILE */}
        <div className={`mobile-menu ${isOpen ? "show" : ""}`}>
          <div className="mobile-menu-header d-flex justify-content-around align-items-center py-3 border-bottom">
            {usuario ? (
              <>
                <Link to="/perfil" onClick={toggleMenu}>
                  <i className="bi bi-person text-white fs-5"></i>
                </Link>
                <Link to="/pedidos" onClick={toggleMenu}>
                  <i className="bi bi-box-seam text-white fs-5"></i>
                </Link>
                {usuario.rolNombre === "ADMIN" && (
                  <Link to="/admin" onClick={toggleMenu}>
                    <i className="bi bi-speedometer text-white fs-5"></i>
                  </Link>
                )}
              </>
            ) : (
              <Link to="/login" onClick={toggleMenu}>
                <i className="bi bi-person text-white fs-5"></i>
              </Link>
            )}

            <Link to="/carrito" onClick={toggleMenu}>
              <i className="bi bi-cart text-white fs-5"></i>
            </Link>
            <Link to="/buscar" onClick={toggleMenu}>
              <i className="bi bi-search text-white fs-5"></i>
            </Link>
          </div>

          <ul className="navbar-nav px-4 pt-3">
            <li className="nav-item mb-2">
              <Link
                className="nav-link text-white"
                to="/papeles-pintados"
                onClick={toggleMenu}
              >
                Papeles Pintados
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link
                className="nav-link text-white"
                to="/fotomurales"
                onClick={toggleMenu}
              >
                Fotomurales
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link
                className="nav-link text-white"
                to="/colecciones"
                onClick={toggleMenu}
              >
                Colecciones
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link
                className="nav-link text-white"
                to="/empresa"
                onClick={toggleMenu}
              >
                La Empresa
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* FONDO TRANSPARENTE PARA CERRAR MENÚ */}
      {isOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={toggleMenu}
          aria-label="Cerrar menú"
        ></div>
      )}
    </>
  );
};

export default Navbar;
