import React, { useEffect, useState } from "react";
import pedidoService from "../../services/pedidoService";

const AdminPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Acceso denegado.");
      return;
    }

    const fetchPedidos = async () => {
      try {
        const data = await pedidoService.getTodosPedidos(token);
        setPedidos(data);
      } catch (err) {
        setError("Error al cargar los pedidos.");
      }
    };

    fetchPedidos();
  }, []);

  return (
    <div className="contenedor-productos">
      <h2>Todos los Pedidos (Admin)</h2>
      {error && <p>{error}</p>}
      {pedidos.length === 0 ? (
        <p>No hay pedidos en el sistema.</p>
      ) : (
        <ul>
          {pedidos.map((pedido) => (
            <li key={pedido.id}>
              <strong>Usuario:</strong> {pedido.usuario?.email} <br />
              <strong>Fecha:</strong> {new Date(pedido.fechaCreacion).toLocaleString()} <br />
              <strong>Estado:</strong> {pedido.estado} <br />
              <strong>Total:</strong> {pedido.total.toFixed(2)} €
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminPedidos;
