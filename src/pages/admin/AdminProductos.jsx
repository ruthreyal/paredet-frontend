import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import productoService from "../../services/productoService";
import "../../styles/admin.css";

const AdminProductos = () => {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

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

  return (
    <div className="admin-usuarios-container">
      <h2 className="section-title">Gestión de Productos</h2>

      <button
        className="btn-gold mb-3"
        onClick={() => navigate("/admin/productos/crear")}
      >
        + Crear producto
      </button>

      {productos.length === 0 ? (
        <p>No hay productos registrados.</p>
      ) : (
        <table className="tabla-entidad-admin">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Referencia</th>
              <th>Precio</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.nombre}</td>
                <td>{producto.referencia}</td>
                <td>{producto.precio.toFixed(2)} €</td>
                <td className="text-end">
                  <button
                    className="btn-accion btn-editar"
                    onClick={() =>
                      navigate(`/admin/productos/editar/${producto.id}`)
                    }
                  >
                    Editar
                  </button>
                  {/* Aquí puedes añadir botón eliminar si lo deseas */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminProductos;

