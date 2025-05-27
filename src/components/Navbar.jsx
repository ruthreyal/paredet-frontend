import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showColecciones, setShowColecciones] = useState(false);
  const toggleColecciones = () => setShowColecciones(!showColecciones);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
    navigate("/");
  };

  return (
    <>
      {/* NAVBAR DESKTOP */}
      <nav className="navbar navbar-expand-lg navbar-dark px-4 shadow-sm d-none d-lg-flex justify-content-between align-items-center sticky-top">
        <ul className="navbar-nav d-flex justify-content-evenly flex-grow-1">
          <li className="nav-item">
            <Link className="nav-link" to="/productos?tipo=papel-pintado">
              Papeles Pintados
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/productos?tipo=fotomural">
              Fotomurales
            </Link>
          </li>
          <li className="nav-item dropdown">
            <div
              className="nav-link dropdown-toggle"
              role="button"
              id="coleccionesDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Colecciones
            </div>
            <ul
              className="dropdown-menu dropdown-menu-oscuro"
              aria-labelledby="coleccionesDropdown"
            >
              <li>
                <Link className="dropdown-item" to="/colecciones/arber">
                  Arber
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/colecciones/rumi">
                  Rumi
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/colecciones/indigo">
                  Indigo
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/colecciones/georgia">
                  Georgia
                </Link>
              </li>
            </ul>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="#">
              La Empresa
            </Link>
          </li>
        </ul>
        <ul className="herramientas navbar-nav align-items-center gap-3 ms-3">
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
            className="logo-text fw-bold text-uppercase mx-auto text-decoration-none"
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
          {/* Fila superior del menú desplegable */}
          <div className="mobile-icons-row">
            {usuario ? (
              <span className="text-white fw-semibold">
                ¡Hola, {usuario.nombre}!
              </span>
            ) : (
              <Link to="/login" onClick={toggleMenu}>
                <i className="bi bi-person text-white fs-5"></i>
              </Link>
            )}
            <Link to="/carrito" onClick={toggleMenu}>
              <i className="bi bi-cart text-white fs-5"></i>
            </Link>
          </div>

          {/* Opciones adicionales si usuario logueado */}
          {usuario && (
            <div className="mobile-user-info px-4 py-2 border-bottom">
              <ul className="list-unstyled mb-0">
                <li>
                  <Link
                    to="/perfil"
                    className="text-white d-block py-1"
                    onClick={toggleMenu}
                  >
                    Mi perfil
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pedidos"
                    className="text-white d-block py-1"
                    onClick={toggleMenu}
                  >
                    Mis pedidos
                  </Link>
                </li>
                {usuario.rolNombre === "ADMIN" && (
                  <li>
                    <Link
                      to="/admin"
                      className="text-white d-block py-1"
                      onClick={toggleMenu}
                    >
                      Panel de administración
                    </Link>
                  </li>
                )}
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="btn btn-link text-white text-start py-1 px-0"
                  >
                    Cerrar sesión
                  </button>
                </li>
              </ul>
            </div>
          )}

          {/* Enlaces del menú */}
          <ul className="navbar-nav px-4 pt-3">
            <li className="nav-item mb-2">
              <Link
                className="nav-link text-white"
                to="/productos?tipo=papel-pintado"
                onClick={toggleMenu}
              >
                Papeles Pintados
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link
                className="nav-link text-white"
                to="/productos?tipo=fotomural"
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
