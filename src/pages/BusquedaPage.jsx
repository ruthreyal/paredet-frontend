import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import productoService from "../services/productoService";
import imagenProductoService from "../services/imagenProductoService";
import favoritoService from "../services/favoritoService";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "../styles/productos.css";

const BusquedaPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const termino = queryParams.get("q") || "";

  const [productos, setProductos] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [orden, setOrden] = useState("relevancia");

  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  const usuarioId = decoded?.id || null;

  useEffect(() => {
    const buscarProductos = async () => {
      try {
        const res = await productoService.getProductos();
        const filtrados = res.data.filter((p) =>
          p.nombre.toLowerCase().includes(termino.toLowerCase())
        );

        const productosConImagen = await Promise.all(
          filtrados.map(async (producto) => {
            try {
              const resImg = await imagenProductoService.getByProducto(producto.id);
              const imagenes = resImg.data;
              return {
                ...producto,
                imagenGaleria: imagenes.length > 0 ? imagenes[0].url : null,
              };
            } catch {
              return { ...producto, imagenGaleria: null };
            }
          })
        );

        setProductos(productosConImagen);

        if (usuarioId) {
          const favoritosRes = await favoritoService.obtenerPorUsuario(usuarioId, token);
          const idsFavoritos = favoritosRes.map((f) => String(f.productoId));
          setFavoritos(idsFavoritos);
        }
      } catch (error) {
        console.error("Error al buscar productos:", error);
      }
    };

    if (termino.trim() !== "") {
      buscarProductos();
    }
  }, [termino, usuarioId, token]);

  const ordenarProductos = (lista) => {
    switch (orden) {
      case "precio-asc":
        return [...lista].sort((a, b) => a.precio - b.precio);
      case "precio-desc":
        return [...lista].sort((a, b) => b.precio - a.precio);
      case "nombre":
        return [...lista].sort((a, b) => a.nombre.localeCompare(b.nombre));
      default:
        return lista;
    }
  };

  const handleFavorito = async (productoId) => {
    if (!usuarioId) {
      alert("Debes iniciar sesión para añadir a favoritos.");
      return;
    }

    const idStr = String(productoId);
    const yaEsFavorito = favoritos.includes(idStr);

    try {
      if (yaEsFavorito) {
        await favoritoService.eliminar(usuarioId, idStr, token);
        setFavoritos(favoritos.filter((id) => id !== idStr));
      } else {
        await favoritoService.agregar(usuarioId, idStr, token);
        setFavoritos([...favoritos, idStr]);
      }
    } catch (error) {
      console.error("Error al actualizar favorito:", error);
    }
  };

  const productosOrdenados = ordenarProductos(productos);

  return (
    <main className="contenedor-productos cuadrada">
      <div className="filtro-orden">
        <h2 className="titulo-pagina">Resultados para: {termino}</h2>
        <div>
          <label htmlFor="orden">Ordenar por:</label>
          <select
            id="orden"
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
            aria-label="Ordenar productos por"
          >
            <option value="relevancia">Relevancia</option>
            <option value="precio-asc">Precio: más baratos primero</option>
            <option value="precio-desc">Precio: más caros primero</option>
            <option value="nombre">Nombre</option>
          </select>
        </div>
      </div>

      {productosOrdenados.length === 0 ? (
        <p>No se encontraron productos que coincidan con tu búsqueda.</p>
      ) : (
        <div className="grid-productos">
          {productosOrdenados.map((producto) => {
            const idStr = String(producto.id);
            const esFavorito = favoritos.includes(idStr);

            return (
              <Link to={`/producto/${producto.id}`} key={producto.id} className="card-producto">
                <div className="imagen-wrapper">
                  <img
                    src={producto.imagenGaleria || "/placeholder.jpg"}
                    alt={producto.nombre}
                    className="imagen-producto"
                  />
                  <button
                    className="btn-favorito"
                    onClick={(e) => {
                      e.preventDefault();
                      handleFavorito(producto.id);
                    }}
                    aria-label={`${esFavorito ? "Quitar de" : "Añadir a"} favoritos`}
                  >
                    {esFavorito ? <FaHeart /> : <FaRegHeart />}
                  </button>
                </div>
                <h3>{producto.nombre}</h3>
                <p>{producto.coleccion?.nombre}</p>
                <p className="precio">{producto.precio} €</p>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default BusquedaPage;

