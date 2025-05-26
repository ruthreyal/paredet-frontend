import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import productoService from "../services/productoService";
import "../styles/productos.css"; // Asegúrate de tener estilos para el grid y las cards

const Producto = () => {
  const [productos, setProductos] = useState([]);
  const [orden, setOrden] = useState("relevancia");
  const [searchParams] = useSearchParams();
  const CATEGORIAS = {
    "papel-pintado": "60b75e42-81be-4134-a929-8720423f3b23",
    fotomural: "c6d9fe55-60a0-4c0f-aef3-27c3f7f57747",
  };
  const tipo = searchParams.get("tipo"); // papel-pintado o fotomural

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await productoService.getProductos();

        const CATEGORIAS = {
          "papel-pintado": "60b75e42-81be-4134-a929-8720423f3b23",
          fotomural: "c6d9fe55-60a0-4c0f-aef3-27c3f7f57747",
        };

        const idCategoria = CATEGORIAS[tipo];

        const filtrados = res.data.filter((p) => p.categoriaId === idCategoria);

        setProductos(filtrados);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };

    fetchProductos();
  }, [tipo]);

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
    <div className="contenedor-productos">
      

      <div className="filtro-orden">
        <div>
        <h2 className="titulo-pagina">
        {tipo === "papel-pintado" ? "Papel pintado" : "Fotomurales"}
      </h2>
      </div>
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
          <div key={producto.id} className="card-producto">
            <div className="imagen-wrapper">
              <img
                src={producto.imagenUrl}
                alt={producto.nombre}
                className="imagen-producto"
              />
            </div>

            <h3>{producto.nombre}</h3>
            <p>{producto.coleccion?.nombre}</p>
            <p className="precio">{producto.precio} €</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Producto;
