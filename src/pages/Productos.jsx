import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import productoService from "../services/productoService";
import favoritoService from "../services/favoritoService";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "../styles/productos.css";
import { Link } from "react-router-dom";
import AlertaToast from "../components/AlertaToast";

const Producto = () => {
  const [productos, setProductos] = useState([]);
  const [orden, setOrden] = useState("relevancia");
  const [favoritos, setFavoritos] = useState([]);
  const [searchParams] = useSearchParams();

  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  const usuarioId = decoded?.id || null;

  const CATEGORIAS = {
    "papel-pintado": "60b75e42-81be-4134-a929-8720423f3b23",
    fotomural: "c6d9fe55-60a0-4c0f-aef3-27c3f7f57747",
  };
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
  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const { exp } = JSON.parse(atob(token.split(".")[1]));
      return Date.now() >= exp * 1000;
    } catch {
      return true;
    }
  };

  const tipo = searchParams.get("tipo");

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const res = await productoService.getProductos();
        const idCategoria = CATEGORIAS[tipo];
        const filtrados = res.data.filter((p) => p.categoriaId === idCategoria);
        setProductos(filtrados);

        if (usuarioId) {
          const favoritosRes = await favoritoService.obtenerPorUsuario(
            usuarioId,
            token
          );
          const idsFavoritos = favoritosRes.map((f) => String(f.productoId));
          setFavoritos(idsFavoritos);
        }
      } catch (error) {
        console.error("Error al obtener productos o favoritos:", error);
      }
    };

    fetchDatos();
  }, [tipo, usuarioId, token]);

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
      mostrarToast("Debes iniciar sesión para añadir a favoritos.", "error");

      return;
    }

    const idStr = String(productoId);
    const yaEsFavorito = favoritos.includes(idStr);

    try {
      if (yaEsFavorito) {
        console.log("Eliminando favorito con:", {
          usuarioId,
          productoId: idStr,
          token,
        });

        await favoritoService.eliminar(usuarioId, idStr, token);
        setFavoritos(favoritos.filter((id) => id !== idStr));
      } else {
        await favoritoService.agregar(usuarioId, idStr, token);
        setFavoritos([...favoritos, idStr]);
      }
    } catch (error) {
      mostrarToast("No se pudo actualizar el favorito. Inténtalo de nuevo.", "error");
    }
  };

  const productosOrdenados = ordenarProductos(productos);

  return (
    <>
      <AlertaToast
        mostrar={toast.mostrar}
        onCerrar={() => setToast({ ...toast, mostrar: false })}
        titulo="Atención"
        mensaje={toast.mensaje}
        tipo={toast.tipo}
      />

      <main className="contenedor-productos">
        <div className="filtro-orden">
          <h2 className="titulo-pagina">
            {tipo === "papel-pintado" ? "Papel pintado" : "Fotomurales"}
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
                className="card-producto"
              >
                <div className="imagen-wrapper">
                  <img
                    src={producto.imagenUrl || "/placeholder.jpg"}
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
    </>
  );
};

export default Producto;
