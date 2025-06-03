import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import productoService from "../services/productoService";
import imagenProductoService from "../services/imagenProductoService";
import favoritoService from "../services/favoritoService";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "../styles/productos.css";
import { Link } from "react-router-dom";

const ColeccionPage = () => {
  const { nombre } = useParams();
  const [productos, setProductos] = useState([]);
  const [orden, setOrden] = useState("relevancia");
  const [favoritos, setFavoritos] = useState([]);

  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  const usuarioId = decoded?.id || null;

  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const { exp } = JSON.parse(atob(token.split(".")[1]));
      return Date.now() >= exp * 1000;
    } catch {
      return true;
    }
  };

  const COLECCIONES = {
    arber: "09b90179-3f19-48a6-8da9-6406910c7276",
    rumi: "19fb4f34-50c3-4026-a2a2-f6b020c7ac7f",
    indigo: "2e3f457c-4261-4bb1-84bc-8e964ae0b1da",
    kalinka: "d7f36f1f-c6e4-4845-adbb-fcbc9f91c363",
    georgia: "eaac8fdf-3e3e-4b10-bd94-3065574b6de8",
  };

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const res = await productoService.getProductos();
        const idColeccion = COLECCIONES[nombre.toLowerCase()];
        const filtrados = res.data.filter((p) => p.coleccionId === idColeccion);

        const productosConImagen = await Promise.all(
          filtrados.map(async (producto) => {
            try {
              const resImg = await imagenProductoService.getByProducto(
                producto.id
              );
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
          const favoritosRes = await favoritoService.obtenerPorUsuario(
            usuarioId,
            token
          );
          const idsFavoritos = favoritosRes.map((f) => String(f.productoId));
          setFavoritos(idsFavoritos);
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchDatos();
  }, [nombre, usuarioId, token]);

  const ordenarProductos = (productos) => {
    switch (orden) {
      case "precio-asc":
        return [...productos].sort((a, b) => a.precio - b.precio);
      case "precio-desc":
        return [...productos].sort((a, b) => b.precio - a.precio);
      case "nombre":
        return [...productos].sort((a, b) => a.nombre.localeCompare(b.nombre));
      default:
        return productos;
    }
  };

  const handleFavorito = async (productoId) => {
    if (!token || isTokenExpired(token)) {
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
        <h2 className="titulo-pagina">
          {nombre.charAt(0).toUpperCase() + nombre.slice(1)}
        </h2>
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

      <div className="grid-productos">
        {productosOrdenados.map((producto) => {
          const idStr = String(producto.id);
          const esFavorito = favoritos.includes(idStr);

          return (
            <Link
              to={`/producto/${producto.id}`}
              key={producto.id}
              className="card-producto cuadrada sin-animacion"
            >
              <div className="imagen-wrapper">
                <img
                  src={producto.imagenGaleria || "/placeholder.jpg"}
                  alt={producto.nombre}
                  className="imagen-producto"
                />
                <button
                  className="btn-favorito"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleFavorito(producto.id);
                  }}
                  aria-label={`${
                    esFavorito ? "Quitar de" : "Añadir a"
                  } favoritos`}
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
    </main>
  );
};

export default ColeccionPage;
