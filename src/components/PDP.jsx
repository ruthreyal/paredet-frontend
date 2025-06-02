import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import productoService from "../services/productoService";
import imagenProductoService from "../services/imagenProductoService";
import "../styles/pdp.css";
import AlertaToast from "../components/AlertaToast";

import {
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import favoritoService from "../services/favoritoService";
import { API_BASE_URL } from "../services/apiConfig";
import { CarritoContext } from "../context/CarritoContext";

const PDP = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [imagenes, setImagenes] = useState([]);
  const [imagenActiva, setImagenActiva] = useState("");
  const [lightboxAbierto, setLightboxAbierto] = useState(false);
  const [indexImagen, setIndexImagen] = useState(0);
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  const usuarioId = decoded?.id || null;
  const [cantidad, setCantidad] = useState(1);
  const [esFavorito, setEsFavorito] = useState(false);
  const [toast, setToast] = useState({
    mostrar: false,
    mensaje: "",
    tipo: "info",
  });

  const mostrarToast = (mensaje, tipo = "info") => {
    setToast({ mostrar: true, mensaje, tipo });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, mostrar: false }));
    }, 4000);
  };

  const { cargarCarrito } = useContext(CarritoContext);

  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const { exp } = JSON.parse(atob(token.split(".")[1]));
      return Date.now() >= exp * 1000;
    } catch {
      return true;
    }
  };

  const handleAddToCart = async () => {
    if (!token || isTokenExpired(token)) {
      mostrarToast("Debes iniciar sesión para añadir al carrito", "info");

      return;
    }

    const payload = { productoId: id, cantidad };
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/carrito/add`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error al añadir producto al carrito");
      }

      mostrarToast("Producto añadido al carrito.", "elegante");

      if (cargarCarrito) await cargarCarrito();
    } catch (error) {
      mostrarToast("Producto añadido al carrito.", "error");

    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resProducto = await productoService.getProductoById(id);
        const productoData = resProducto.data;
        setProducto(productoData);

        const resImagenes = await imagenProductoService.getByProducto(id);
        const imagenesData = resImagenes.data;
        setImagenes(imagenesData);
        setImagenActiva(
          imagenesData[0]?.url || productoData.imagenUrl || "/placeholder.jpg"
        );

        const isTokenExpired = (token) => {
          if (!token) return true;
          try {
            const { exp } = JSON.parse(atob(token.split(".")[1]));
            return Date.now() >= exp * 1000;
          } catch {
            return true;
          }
        };

        if (token && !isTokenExpired(token)) {
          const decoded = jwtDecode(token);
          const usuarioId = decoded?.id;
          const favoritosRes = await favoritoService.obtenerPorUsuario(
            usuarioId,
            token
          );
          const idsFavoritos = favoritosRes.map((f) => String(f.productoId));
          setEsFavorito(idsFavoritos.includes(id));
        }
      } catch (error) {
        console.error("Error al cargar datos del producto o favoritos", error);
      }
    };

    fetchData();
  }, [id, token]);

  const toggleFavorito = async () => {
    if (!token || isTokenExpired(token)) {
      mostrarToast("Debes iniciar sesión para usar favoritos.", "info");

      return;
    }

    try {
      if (esFavorito) {
        await favoritoService.eliminar(usuarioId, id, token);
        setEsFavorito(false);
      } else {
        await favoritoService.agregar(usuarioId, id, token);
        setEsFavorito(true);
      }
    } catch (error) {
      mostrarToast("Hubo un error intentelo de nuevo.", "error");

    }
  };

  const abrirLightbox = (index) => {
    setIndexImagen(index);
    setLightboxAbierto(true);
  };

  const cerrarLightbox = () => setLightboxAbierto(false);

  const cambiarImagen = (offset) => {
    const total = imagenes.length;
    setIndexImagen((prev) => (prev + offset + total) % total);
  };

  if (!producto) return <p>Cargando producto...</p>;

  return (
    <>
      <AlertaToast
        mostrar={toast.mostrar}
        onCerrar={() => setToast({ ...toast, mostrar: false })}
        titulo="Notificación"
        mensaje={toast.mensaje}
        tipo={toast.tipo}
      />

      <div className="pdp-container">
        <div className="pdp-galeria">
          <img
            src={imagenActiva}
            alt={producto.nombre}
            className="imagen-principal"
            onClick={() =>
              abrirLightbox(
                imagenes.findIndex((img) => img.url === imagenActiva)
              )
            }
          />
          <div className="miniaturas">
            {imagenes.map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                alt={`Miniatura ${idx + 1}`}
                onClick={() => {
                  setImagenActiva(img.url);
                  abrirLightbox(idx);
                }}
                className={imagenActiva === img.url ? "activa" : ""}
              />
            ))}
          </div>
        </div>

        <div className="pdp-info">
          <h1>{producto.nombre}</h1>
          <p>
            <strong>Referencia:</strong> {producto.referencia}
          </p>
          <p>{producto.descripcion}</p>

          <div className="caracteristicas">
            <h2>Características técnicas</h2>
            {producto.formato && (
              <p>
                <strong>Formato:</strong> {producto.formato}
              </p>
            )}
            {producto.tipoAplicacion && (
              <p>
                <strong>Aplicación:</strong> {producto.tipoAplicacion}
              </p>
            )}
            {producto.peso && (
              <p>
                <strong>Peso:</strong> {producto.peso} g/m²
              </p>
            )}
            {producto.familia && (
              <p>
                <strong>Familia:</strong> {producto.familia}
              </p>
            )}
          </div>

          <div className="acciones-pdp">
            <div
              onClick={toggleFavorito}
              className={`favorito-toggle ${esFavorito ? "activo" : ""}`}
              role="button"
              tabIndex={0}
              aria-label={
                esFavorito ? "Quitar de favoritos" : "Añadir a favoritos"
              }
            >
              {esFavorito ? <FaHeart /> : <FaRegHeart />}{" "}
              {esFavorito ? "Quitar de favoritos" : "Añadir a favoritos"}
            </div>

            <div className="cantidad-carrito">
              <label htmlFor="cantidad">Cantidad:</label>
              <input
                id="cantidad"
                type="number"
                min="1"
                value={cantidad}
                onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
              />
              <button className="btn btn-outline-dark w-100" onClick={handleAddToCart}>
                Añadir al carrito
              </button>
            </div>
          </div>
        </div>

        {lightboxAbierto && (
          <div className="lightbox">
            <button
              className="cerrar"
              aria-label="Cerrar galería"
              onClick={cerrarLightbox}
            >
              <FaTimes />
            </button>

            <button
              className="flecha izq"
              onClick={() => cambiarImagen(-1)}
              aria-label="Anterior"
            >
              <FaChevronLeft />
            </button>
            <img src={imagenes[indexImagen].url} alt="Imagen ampliada" />
            <button
              className="flecha der"
              onClick={() => cambiarImagen(1)}
              aria-label="Siguiente"
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default PDP;
