import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import productoService from "../services/productoService";
import imagenProductoService from "../services/imagenProductoService";
import "../styles/pdp.css";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import favoritoService from "../services/favoritoService";
import { FaHeart, FaRegHeart } from "react-icons/fa";

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

  const [esFavorito, setEsFavorito] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener producto
        const resProducto = await productoService.getProductoById(id);
        const productoData = resProducto.data;
        setProducto(productoData);

        // Obtener imágenes
        const resImagenes = await imagenProductoService.getByProducto(id);
        const imagenesData = resImagenes.data;
        setImagenes(imagenesData);
        setImagenActiva(
          imagenesData[0]?.url || productoData.imagenUrl || "/placeholder.jpg"
        );

        // Comprobar si es favorito
        if (usuarioId) {
          const favoritosRes = await favoritoService.obtenerPorUsuario(
            usuarioId,
            token
          );
          const idsFavoritos = favoritosRes.map((f) => String(f.productoId));
          setEsFavorito(idsFavoritos.includes(id));
        }
      } catch (error) {
        console.error("Error al cargar datos del producto", error);
      }
    };

    fetchData();
  }, [id, usuarioId, token]);

  const toggleFavorito = async () => {
    if (!usuarioId) {
      alert("Debes iniciar sesión para usar favoritos.");
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
      console.error("Error al actualizar favorito:", error);
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
    <div className="pdp-container">
      <div className="pdp-galeria">
        <img
          src={imagenActiva}
          alt={producto.nombre}
          className="imagen-principal"
          onClick={() =>
            abrirLightbox(imagenes.findIndex((img) => img.url === imagenActiva))
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
          <button className="btn-personalizado" disabled>
            Añadir al carrito
          </button>

          <button
            type="button"
            className={`btn-personalizado ${esFavorito ? "activo" : ""}`}
            onClick={toggleFavorito}
            aria-label={
              esFavorito ? "Quitar de favoritos" : "Añadir a favoritos"
            }
          >
            <span className="icono-corazon">
              {esFavorito ? <FaHeart /> : <FaRegHeart />}
            </span>
            {esFavorito ? "Quitar de favoritos" : "Añadir a favoritos"}
          </button>
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
  );
};

export default PDP;
