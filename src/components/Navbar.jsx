import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/navbar.css";
import { CarritoContext } from "../context/CarritoContext";
import coleccionService from "../services/coleccionService";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showColecciones, setShowColecciones] = useState(false);
  const toggleColecciones = () => setShowColecciones(!showColecciones);
  const { totalCarrito } = useContext(CarritoContext);
  const { vaciarCarrito } = useContext(CarritoContext);
  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);
  const [colecciones, setColecciones] = useState([]);

  useEffect(() => {
    const cargarColecciones = async () => {
      try {
        const response = await coleccionService.getColecciones();
        setColecciones(response.data);
      } catch (error) {
        console.error("Error al cargar colecciones:", error);
      }
    };

    cargarColecciones();
  }, []);

  const handleLogout = () => {
    vaciarCarrito();
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
            <Link
              className="nav-link"
              to="/productos?tipo=papel-pintado"
              aria-label="Papeles pintados"
            >
              Papeles Pintados
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              to="/productos?tipo=fotomural"
              aria-label="Fotomurales"
            >
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
              {colecciones.map((coleccion) => (
                <li key={coleccion.id}>
                  <Link
                    className="dropdown-item"
                    to={`/colecciones/${coleccion.nombre.toLowerCase()}`}
                    aria-label={coleccion.nombre}
                  >
                    {coleccion.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </li>

          <li className="nav-item">
            <Link to="/empresa" className="nav-link" aria-label="La empresa">
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
                  aria-label="Iniciar sesión"
                >
                  <i className="bi bi-person"></i>{" "}
                  <span className="ms-1">¡Hola, {usuario.nombre}!</span>
                </Link>
                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-oscuro">
                  <li>
                    <Link to="/perfil" aria-label="Mi perfil">
                      Mi perfil
                    </Link>
                  </li>
                  <li>
                    <Link to="/favoritos" aria-label="Favoritos">
                      Favoritos
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/pedidos"
                      className="dropdown-item"
                      aria-label="Mis pedidos"
                    >
                      Mis pedidos
                    </Link>
                  </li>
                  {usuario.rolNombre === "ADMIN" && (
                    <li>
                      <Link to="/admin">Panel de administración</Link>
                    </li>
                  )}
                  <li>
                    <button onClick={handleLogout} aria-label="Cerrar sesion">
                      Cerrar sesión
                    </button>
                  </li>
                </ul>
              </div>
            </li>
          ) : (
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/login"
                aria-label="Iniciar sesion"
              >
                <i className="bi bi-person"></i>
              </Link>
            </li>
          )}
          <li className="nav-item">
            <Link
              className="nav-link position-relative"
              to="/carrito"
              aria-label="Carrito"
            >
              <i className="bi bi-cart"></i>
              {totalCarrito > 0 && (
                <span className="badge badge-carrito position-absolute top-0 start-100 translate-middle rounded-pill">
                  {totalCarrito}
                </span>
              )}
            </Link>
          </li>

          <li className="nav-item">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const search = e.target.search.value.trim();
                if (search) {
                  navigate(`/buscar?q=${encodeURIComponent(search)}`);
                }
              }}
              className="d-flex align-items-center"
            >
              <input
                type="text"
                name="search"
                placeholder="Buscar..."
                className="form-control me-2"
                aria-label="Buscar productos"
              />
              <button
                type="submit"
                className="btn btn-outline-light"
                aria-label="Buscar"
              >
                <i className="bi bi-search"></i>
              </button>
            </form>
          </li>
        </ul>
      </nav>
      {/* CONTENEDOR NAVBAR + MENÚ */}
      <div className="navbar-mobile-wrapper d-lg-none">
        {/* NAVBAR MOBILE */}
        <nav className="navbar navbar-dark custom-navbar-mobile d-flex justify-content-between align-items-center px-4 py-3">
          <button
            className={`menu-toggle ${isOpen ? "open" : ""}`}
            onClick={toggleMenu}
            aria-label="menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <Link
            to="/"
            className="logo-text fw-bold text-uppercase mx-auto text-decoration-none"
          >
            PAREDET
          </Link>

          <Link
            to="/carrito"
            className="text-white position-relative fs-5"
            aria-label="Carrito"
          >
            <i className="bi bi-cart"></i>
            {totalCarrito > 0 && (
              <span className="badge badge-carrito text-dark position-absolute top-0 start-100 translate-middle rounded-pill">
                {totalCarrito}
              </span>
            )}
          </Link>
        </nav>

        {/* MENÚ DESPLEGABLE MOBILE */}
        <div className={`mobile-menu ${isOpen ? "show" : ""}`}>
          <div className="mobile-icons-row">
            {usuario ? (
              <button
                className="mobile-toggle-usuario text-white"
                onClick={toggleProfileMenu}
                aria-expanded={isProfileMenuOpen}
                aria-controls="submenu-usuario"
              >
                ¡Hola, {usuario.nombre}!{" "}
                <i className="bi bi-caret-down-fill"></i>
              </button>
            ) : (
              <Link
                to="/login"
                onClick={toggleMenu}
                aria-label="Iniciar sesión"
              >
                <i className="bi bi-person text-white fs-5"></i>
              </Link>
            )}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const search = e.target.search.value.trim();
              if (search) {
                navigate(`/buscar?q=${encodeURIComponent(search)}`);
                toggleMenu();
              }
            }}
            className="mobile-search-form d-flex align-items-center gap-2 px-4 pb-3"
          >
            <input
              type="text"
              name="search"
              placeholder="Buscar..."
              className="form-control"
              aria-label="Buscar productos"
            />
            <button type="submit" className="btn btn-outline-light">
              <i className="bi bi-search"></i>
            </button>
          </form>
          {/* SUBMENÚ USUARIO */}
          {usuario && isProfileMenuOpen && (
            <ul className="submenu-desplegable list-unstyled ps-5 mt-2">
              <li>
                <Link
                  to="/perfil"
                  className="text-white d-block py-1"
                  aria-label="Mi perfil"
                  onClick={toggleMenu}
                >
                  Mi perfil
                </Link>
              </li>
              <li>
                <li>
                  <Link
                    to="/favoritos"
                    className="text-white d-block py-1"
                    aria-label="Favoritos"
                    onClick={toggleMenu}
                  >
                    Favoritos
                  </Link>
                </li>

                <Link
                  to="/pedidos"
                  className="dropdown-item"
                  aria-label="Mis pedidos"
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
                  aria-label="Cerrar sesión"
                >
                  Cerrar sesión
                </button>
              </li>
            </ul>
          )}

          {/* Enlaces principales */}
          <ul className="navbar-nav px-4 pt-3">
            <li className="nav-item mb-2">
              <Link
                className="nav-link text-white"
                to="/productos?tipo=papel-pintado"
                aria-label="Papeles pintados"
                onClick={toggleMenu}
              >
                Papeles Pintados
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link
                className="nav-link text-white"
                to="/productos?tipo=fotomural"
                aria-label="Fotomurales"
                onClick={toggleMenu}
              >
                Fotomurales
              </Link>
            </li>
            <li className="nav-item mb-2">
              <button
                className="nav-link text-white btn btn-link p-0"
                onClick={toggleColecciones}
                aria-expanded={showColecciones}
                aria-controls="submenu-colecciones"
              >
                Colecciones
              </button>
              {showColecciones && (
                <ul className="submenu-desplegable list-unstyled ps-5 mt-2">
                  {colecciones.map((coleccion) => (
                    <li key={coleccion.id}>
                      <Link
                        to={`/colecciones/${coleccion.nombre.toLowerCase()}`}
                        className="text-white d-block py-1"
                        aria-label={coleccion.nombre}
                        onClick={toggleMenu}
                      >
                        {coleccion.nombre}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <li className="nav-item mb-2">
              <Link to="/empresa" className="nav-link" aria-label="La empresa">
                La Empresa
              </Link>
            </li>
          </ul>
        </div>

        {/* FONDO TRANSPARENTE PARA CERRAR MENÚ */}
        {isOpen && (
          <div
            className="mobile-menu-overlay"
            onClick={toggleMenu}
            aria-label="Cerrar menú"
          ></div>
        )}
      </div>
    </>
  );
};

export default Navbar;
