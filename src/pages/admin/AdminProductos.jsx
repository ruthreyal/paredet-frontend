import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import productoService from "../../services/productoService";
import "../../styles/admin.css";

const AdminProductos = () => {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const response = await productoService.getProductos();
        setProductos(response.data);
      } catch (error) {
        console.error("Error al cargar productos", error);
      }
    };

    cargarProductos();
  }, []);

  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="admin-usuarios-container">
      <h2 className="section-title">Gestión de Productos</h2>

      <div className="acciones-admin-productos">
        <button
          className="btn btn-outline-dark"
          onClick={() => navigate("/admin/productos/crear")}
        >
          + Crear producto
        </button>

        <input
          type="text"
          className="form-control buscador-admin"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          aria-label="Buscar producto por nombre"
        />
      </div>

      {productos.length === 0 ? (
        <p>No hay productos registrados.</p>
      ) : (
        <table className="tabla-entidad-admin">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Referencia</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((producto) => (
              <tr
                key={producto.id}
                onClick={() =>
                  navigate(`/admin/productos/editar/${producto.id}`)
                }
                className="fila-clicable"
              >
                <td>{producto.nombre}</td>
                <td>{producto.referencia}</td>
                <td>{producto.precio.toFixed(2)} €</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminProductos;
