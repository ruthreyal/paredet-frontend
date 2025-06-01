import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import favoritoService from "../services/favoritoService";
import productoService from "../services/productoService";
import imagenProductoService from "../services/imagenProductoService";
import { useNavigate } from "react-router-dom";
import AlertaToast from "../components/AlertaToast";
import { API_BASE_URL } from "../services/apiConfig";
import { CarritoContext } from "../context/CarritoContext";
import { useContext } from "react";

import "../styles/favoritos.css";

const Favoritos = () => {
  const [productos, setProductos] = useState([]);
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  const usuarioId = decoded?.id || null;

  const handleEliminarFavorito = async (productoId) => {
    const element = document.getElementById(`favorito-${productoId}`);
    if (element) {
      element.classList.add("fade-out");

      setTimeout(async () => {
        try {
          await favoritoService.eliminar(usuarioId, productoId, token);
          setProductos((prev) => prev.filter((p) => p.id !== productoId));
        } catch (error) {
          console.error(
            "Error al eliminar favorito:",
            error.response?.data || error.message
          );
        }
      }, 400);
    }
  };

  useEffect(() => {
    const fetchFavoritos = async () => {
      if (!usuarioId) {
        setMensajeAlerta(
          <>
            Para ver tus favoritos, primero debes{" "}
            <a href="/login" className="text-primary">
              iniciar sesión
            </a>{" "}
            o{" "}
            <a href="/registro" className="text-primary">
              registrarte
            </a>
            .
          </>
        );
        setMostrarAlerta(true);
        return;
      }

      try {
        const favoritosData = await favoritoService.obtenerPorUsuario(
          usuarioId,
          token
        );

        const productosConDatos = await Promise.all(
          favoritosData.map(async (fav) => {
            const producto = await productoService.getProductoById(
              fav.productoId
            );

            const imagenRes = await imagenProductoService.getByProducto(
              fav.productoId
            );
            return {
              ...producto.data,
              imagen: imagenRes.data?.[0]?.url || "/placeholder.jpg",
            };
          })
        );

        setProductos(productosConDatos);
      } catch (error) {
        console.error("Error al cargar favoritos:", error);
      }
    };

    fetchFavoritos();
  }, [usuarioId, token]);

  const { cargarCarrito } = useContext(CarritoContext);

  const handleAddToCart = async (productoId, cantidad = 1) => {
    if (!token) {
      alert("Debes iniciar sesión para añadir productos al carrito.");
      return;
    }

    const payload = { productoId, cantidad };
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

      if (cargarCarrito) await cargarCarrito();
      alert("Producto añadido al carrito");
    } catch (error) {
      console.error("Error en handleAddToCart:", error);
      alert("Hubo un error. Inténtalo de nuevo.");
    }
  };

  return (
    <>
      <main className="contenedor-productos-favoritos">
        <h2 className="titulo-pagina">Mis Favoritos</h2>

        {productos.length === 0 ? (
          <p>No tienes productos en favoritos.</p>
        ) : (
          <div className="lista-favoritos">
            {productos.map((producto) => (
              <div
                key={producto.id}
                id={`favorito-${producto.id}`}
                className="item-favorito row align-items-center p-3 shadow-sm rounded mb-3"
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/producto/${producto.id}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") navigate(`/producto/${producto.id}`);
                }}
              >
                {/* Imagen */}
                <div className="col-md-2 col-4">
                  <img
                    src={producto.imagen || "/placeholder.jpg"}
                    alt={producto.nombre}
                    className="img-fluid rounded"
                    style={{
                      height: "100px",
                      objectFit: "cover",
                      width: "100%",
                    }}
                  />
                </div>

                {/* Información */}
                <div className="col-md-7 col-8">
                  <h5 className="mb-1">{producto.nombre}</h5>
                  <p className="mb-1 text-muted">
                    {producto.descripcion || "Sin descripción disponible."}
                  </p>
                  <p className="mb-0 fw-bold text-primary">
                    {producto.precio} €
                  </p>
                </div>

                {/* Botones */}
                <div className="col-md-3 mt-3 mt-md-0 d-flex flex-column gap-2">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(producto.id);
                    }}
                  >
                    Añadir al carrito
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEliminarFavorito(producto.id);
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <AlertaToast
        mostrar={mostrarAlerta}
        onCerrar={() => setMostrarAlerta(false)}
        titulo="Aviso"
        mensaje={mensajeAlerta}
      />
    </>
  );
};

export default Favoritos;
