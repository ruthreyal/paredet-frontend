import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import productoService from "../services/productoService";
import imagenProductoService from "../services/imagenProductoService";
import "../styles/productos.css";

const COLECCIONES = {
  arber: "09b90179-3f19-48a6-8da9-6406910c7276",
  rumi: "19fb4f34-50c3-4026-a2a2-f6b020c7ac7f",
  indigo: "2e3f457c-4261-4bb1-84bc-8e964ae0b1da",
  kalinka: "d7f36f1f-c6e4-4845-adbb-fcbc9f91c363",
  georgia: "eaac8fdf-3e3e-4b10-bd94-3065574b6de8",
};

const Coleccion = () => {
  const { nombre } = useParams();
  const [productos, setProductos] = useState([]);
  const [orden, setOrden] = useState("relevancia");

  useEffect(() => {
    const fetchProductos = async () => {
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
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };

    fetchProductos();
  }, [nombre]);

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
          >
            <option value="relevancia">Relevancia</option>
            <option value="precio-asc">Precio: más baratos primero</option>
            <option value="precio-desc">Precio: más caros primero</option>
            <option value="nombre">Nombre</option>
          </select>
        </div>
      </div>

      <div className="grid-productos">
        {productosOrdenados.map((producto) => (
          <div key={producto.id} className="card-producto sin-animacion">
            <div className="imagen-wrapper">
              <img
                src={producto.imagenGaleria || "/placeholder.jpg"}
                alt={producto.nombre}
                className="imagen-producto"
              />
              <button className="btn-favorito" aria-label="Añadir a favoritos">
                ❤
              </button>
            </div>
            <h3>{producto.nombre}</h3>
            <p>{producto.coleccion?.nombre}</p>
            <p className="precio">{producto.precio} €</p>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Coleccion;
